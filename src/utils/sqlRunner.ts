import { TableData, QueryExecutionStep } from '../types';
import { SCHEMAS_DATABASE } from '../data/lessons';

export interface SQLRunnerResult {
  success: boolean;
  error?: string;
  columns: string[];
  rows: Record<string, any>[];
  steps: QueryExecutionStep[];
}

export function parseAndExecuteSQL(rawSql: string, parentRow?: Record<string, any>): SQLRunnerResult {
  // Check for PL/SQL block or CREATE statement (which we want to simulate as PL/SQL)
  const upperOriginal = rawSql.trim().toUpperCase();
  if (upperOriginal.startsWith('DECLARE') || upperOriginal.startsWith('BEGIN') || upperOriginal.startsWith('CREATE ') || upperOriginal.startsWith('<<') || upperOriginal.includes('DBMS_OUTPUT') || upperOriginal.startsWith('EXPLAIN') || upperOriginal.startsWith('ALTER') || upperOriginal.startsWith('DROP') || upperOriginal.startsWith('INSERT') || upperOriginal.startsWith('UPDATE') || upperOriginal.startsWith('DELETE')) {
    return simulatePLSQL(rawSql);
  }

  const steps: QueryExecutionStep[] = [];
  
  // Clean up SQL
  let sql = rawSql.trim().replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\s+/g, ' ');
  if (sql.endsWith(';')) {
    sql = sql.slice(0, -1).trim();
  }

  // Substitute correlated parent references if parentRow is provided
  if (parentRow) {
    Object.keys(parentRow).forEach(key => {
      // ONLY substitute qualified parent references (e.g., e.department_id)
      if (!key.includes('.')) return;
      
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedKey}\\b`, 'gi');
      let val = parentRow[key];
      if (typeof val === 'string') {
        val = `'${val}'`;
      } else if (val == null) {
        val = 'NULL';
      }
      sql = sql.replace(regex, String(val));
    });
  }

  // Basic syntax check: must start with SELECT
  if (!sql.toUpperCase().startsWith('SELECT')) {
    return {
      success: false,
      error: "Syntax Error: A query to read data must start with the SELECT keyword.",
      columns: [],
      rows: [],
      steps: []
    };
  }

  // Decompose clauses using clause position finder
  const indices = findClauseIndices(sql);
  const sorted = Object.entries(indices).sort((a, b) => a[1] - b[1]);

  if (!indices['FROM']) {
    return {
      success: false,
      error: "Syntax Error: Missing FROM clause. SQL needs to know which table to query. Example: SELECT * FROM employees;",
      columns: [],
      rows: [],
      steps: []
    };
  }

  // Clause order checking
  const clausesOrder = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'];
  let lastOrderIdx = -1;
  for (const [kw] of sorted) {
    const orderIdx = clausesOrder.indexOf(kw);
    if (orderIdx < lastOrderIdx) {
      return {
        success: false,
        error: `Clause Order Error: Incorrect sequence of clauses. Correct sequence: SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY`,
        columns: [],
        rows: [],
        steps: []
      };
    }
    lastOrderIdx = orderIdx;
  }

  const clauses: Record<string, string> = {
    SELECT: '',
    FROM: '',
    WHERE: '',
    'GROUP BY': '',
    HAVING: '',
    'ORDER BY': ''
  };

  for (let i = 0; i < sorted.length; i++) {
    const [kw, idx] = sorted[i];
    const nextIdx = i + 1 < sorted.length ? sorted[i + 1][1] : sql.length;
    clauses[kw] = sql.substring(idx + kw.length, nextIdx).trim();
  }

  const selectClause = clauses['SELECT'];
  const fromClause = clauses['FROM'];
  const whereClause = clauses['WHERE'];
  const groupByClause = clauses['GROUP BY'];
  const havingClause = clauses['HAVING'];
  const orderByClause = clauses['ORDER BY'];

  // Parse FROM clause and Joins
  let dbTable: { table_name: string; columns: string[]; rows: any[] };
  let tableColumns: string[] = [];

  const fromClauseLower = fromClause.toLowerCase();
  const hasJoins = fromClauseLower.includes('join');

  if (hasJoins) {
    const parsedFrom = parseFromClauseAndJoin(fromClause);
    if (!parsedFrom) {
      return {
        success: false,
        error: `Join Syntax Error: Could not parse FROM clause with joins: "${fromClause}"`,
        columns: [],
        rows: [],
        steps: []
      };
    }

    const joinResult = executeJoins(parsedFrom, steps);
    if (!joinResult.success) {
      return {
        success: false,
        error: joinResult.error,
        columns: [],
        rows: [],
        steps: []
      };
    }

    dbTable = {
      table_name: joinResult.tableName,
      columns: joinResult.columns,
      rows: joinResult.rows
    };
    tableColumns = joinResult.columns;
  } else {
    // Single table query or inline view
    if (fromClause.trim().startsWith('(')) {
      const trimmed = fromClause.trim();
      const lastParenIdx = trimmed.lastIndexOf(')');
      const subquerySql = trimmed.substring(1, lastParenIdx).trim();
      const aliasPart = trimmed.substring(lastParenIdx + 1).trim();
      const partsAlias = aliasPart.split(/\s+/);
      const aliasName = (partsAlias[partsAlias.length - 1] || 'inline_view').toLowerCase().replace(/[^a-z0-9_]/g, '');

      const subResult = parseAndExecuteSQL(subquerySql);
      if (!subResult.success) {
        return {
          success: false,
          error: `Subquery in FROM clause failed: ${subResult.error}`,
          columns: [],
          rows: [],
          steps: []
        };
      }

      dbTable = {
        table_name: aliasName,
        columns: subResult.columns,
        rows: subResult.rows
      };
      
      const columnsSet = new Set<string>();
      subResult.columns.forEach(col => {
        columnsSet.add(col.toLowerCase());
        columnsSet.add(`${aliasName}.${col.toLowerCase()}`);
      });
      tableColumns = Array.from(columnsSet);

      steps.push({
        type: 'open_table',
        message: `Database evaluates inline subquery and names it "${dbTable.table_name}" with ${dbTable.rows.length} records.`,
        tempRows: [...dbTable.rows]
      });
    } else {
      const parts = fromClause.trim().split(/\s+/);
      const tableName = parts[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
      const aliasName = parts[1] ? parts[1].toLowerCase().replace(/[^a-z0-9_]/g, '') : tableName;
      const foundTable = SCHEMAS_DATABASE[tableName];

      if (!foundTable) {
        const knownTables = Object.keys(SCHEMAS_DATABASE).join(', ');
        return {
          success: false,
          error: `Table Error: Table "${parts[0]}" does not exist in our database. Did you mean one of these: ${knownTables}? (Case-insensitive)`,
          columns: [],
          rows: [],
          steps: []
        };
      }

      dbTable = {
        table_name: foundTable.table_name,
        columns: [...foundTable.columns],
        rows: foundTable.rows.map(row => {
          const newRow: Record<string, any> = {};
          foundTable.columns.forEach(col => {
            const lowerCol = col.toLowerCase();
            newRow[lowerCol] = row[col];
            newRow[`${foundTable.table_name.toLowerCase()}.${lowerCol}`] = row[col];
            newRow[`${aliasName.toLowerCase()}.${lowerCol}`] = row[col];
          });
          return newRow;
        })
      };
      
      // Support table name and alias qualified column names as available columns
      const columnsSet = new Set<string>();
      foundTable.columns.forEach(col => {
        columnsSet.add(col.toLowerCase());
        columnsSet.add(`${foundTable.table_name.toLowerCase()}.${col.toLowerCase()}`);
        columnsSet.add(`${aliasName.toLowerCase()}.${col.toLowerCase()}`);
      });
      tableColumns = Array.from(columnsSet);

      steps.push({
        type: 'open_table',
        message: `Database locates and opens the "${dbTable.table_name}" table which has ${dbTable.rows.length} records.`,
        tempRows: [...dbTable.rows]
      });
    }
  }

  // Extract Columns & DISTINCT
  let isDistinct = false;
  let cleanSelectClause = selectClause;
  if (selectClause.toUpperCase().startsWith('DISTINCT')) {
    isDistinct = true;
    cleanSelectClause = selectClause.substring(8).trim();
  }

  // Parse columns and their aliases (ignoring commas inside parentheses)
  const colSegments: { raw: string; column: string; alias?: string }[] = [];
  let currentSegment = '';
  let insideQuotes = false;
  let parenDepth = 0;

  for (let i = 0; i < cleanSelectClause.length; i++) {
    const char = cleanSelectClause[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === '(' && !insideQuotes) {
      parenDepth++;
    } else if (char === ')' && !insideQuotes) {
      parenDepth--;
    }
    
    if (char === ',' && !insideQuotes && parenDepth === 0) {
      colSegments.push(parseColumnSegment(currentSegment.trim()));
      currentSegment = '';
    } else {
      currentSegment += char;
    }
  }
  if (currentSegment.trim()) {
    colSegments.push(parseColumnSegment(currentSegment.trim()));
  }

  // Validate columns
  const isWildcard = colSegments.length === 1 && colSegments[0].column === '*';

  if (!isWildcard) {
    for (const seg of colSegments) {
      const underlying = getUnderlyingColumn(seg.column);
      const upperSeg = seg.column.toUpperCase();
      const isExpression = upperSeg.includes('SELECT') || 
                           upperSeg.includes('||') || 
                           upperSeg.includes('OVER') || 
                           upperSeg.includes('CASE') || 
                           upperSeg.includes('COALESCE') || 
                           upperSeg.includes('NVL') || 
                           upperSeg.includes('DECODE');

      if (underlying !== '*' && isNaN(Number(underlying)) && !underlying.startsWith("'") && !isExpression) {
        const foundVal = tableColumns.find(c => c.toLowerCase() === underlying.toLowerCase());
        if (!foundVal) {
          return {
            success: false,
            error: `Column Error: Column "${seg.column}" is not in available table(s). Available columns: ${tableColumns.filter(c => !c.includes('.')).join(', ')}`,
            columns: [],
            rows: [],
            steps: []
          };
        }
      }
    }
  }

  // --- STAGE 1: Filtering via WHERE ---
  let filteredRows = [...dbTable.rows];
  
  if (whereClause) {
    const parsedWhere = parseWhereClause(whereClause);
    if (!parsedWhere) {
      return {
        success: false,
        error: `Syntax Error: Could not parse WHERE condition "${whereClause}". Ensure it has a format like: column = value, column > number, or column <> value. Note: string values require single quotes!`,
        columns: [],
        rows: [],
        steps: []
      };
    }

    const { column, operator, rawValue } = parsedWhere;
    const lowerColumn = column.toLowerCase();

    if (operator !== 'EXISTS' && operator !== 'NOT EXISTS') {
      const foundCol = tableColumns.find(c => c.toLowerCase() === lowerColumn);
      if (!foundCol) {
        return {
          success: false,
          error: `WHERE Column Error: Column "${column}" used in WHERE filter is not found in table(s).`,
          columns: [],
          rows: [],
          steps: []
        };
      }
    }

    filteredRows = [];
    
    for (let rIndex = 0; rIndex < dbTable.rows.length; rIndex++) {
      const originalRow = dbTable.rows[rIndex];
      const actualVal = getRowValue(originalRow, column);
      let matches = false;

      // Check condition
      if (operator === 'EXISTS' || operator === 'NOT EXISTS') {
        const isNot = operator === 'NOT EXISTS';
        let exists = false;
        if (rawValue.startsWith('(') && rawValue.endsWith(')')) {
          const inner = rawValue.slice(1, -1);
          const subResult = parseAndExecuteSQL(inner, originalRow);
          exists = subResult.success && subResult.rows.length > 0;
        }
        matches = isNot ? !exists : exists;
      } else if (operator === 'IS NULL') {
        matches = actualVal == null;
      } else if (operator === 'IS NOT NULL') {
        matches = actualVal != null;
      } else if (operator === 'BETWEEN') {
        const bounds = rawValue.split(/\s+AND\s+/i);
        if (bounds.length === 2) {
          const low = Number(bounds[0].replace(/['"]/g, '').trim());
          const high = Number(bounds[1].replace(/['"]/g, '').trim());
          const actualNum = Number(actualVal);
          matches = !isNaN(actualNum) && actualNum >= low && actualNum <= high;
        }
      } else if (operator === 'LIKE') {
        const pattern = rawValue.replace(/['"]/g, '').trim();
        const escaped = pattern.replace(/[.+^${}()|[\]\\]/g, '\\$&');
        const regexStr = '^' + escaped.replace(/%/g, '.*').replace(/_/g, '.') + '$';
        const regex = new RegExp(regexStr, 'i');
        matches = regex.test(String(actualVal ?? ''));
      } else if (operator === 'IN') {
        if (rawValue.toUpperCase().includes('SELECT')) {
          const subqueryMatch = rawValue.match(/\(\s*(SELECT[\s\S]+?)\s*\)/i);
          if (subqueryMatch && subqueryMatch[1]) {
            const subqueryResult = parseAndExecuteSQL(subqueryMatch[1], originalRow);
            if (subqueryResult.success) {
              const values = subqueryResult.rows.map(row => {
                const firstKey = Object.keys(row)[0];
                return String(row[firstKey]);
              });
              matches = values.includes(String(actualVal ?? ''));
            }
          }
        } else {
          const inStr = rawValue.replace(/[()]/g, '');
          const inValues = inStr.split(',').map(v => v.trim().replace(/['"]/g, ''));
          matches = inValues.includes(String(actualVal ?? ''));
        }
      } else if (rawValue.toUpperCase().startsWith('ANY') || rawValue.toUpperCase().startsWith('ALL')) {
        const isAny = rawValue.toUpperCase().startsWith('ANY');
        const subqueryStr = rawValue.replace(/^(ANY|ALL)\s*/i, '').trim();
        let subValues: any[] = [];
        if (subqueryStr.startsWith('(') && subqueryStr.endsWith(')')) {
          const inner = subqueryStr.slice(1, -1);
          const subResult = parseAndExecuteSQL(inner, originalRow);
          if (subResult.success) {
            subValues = subResult.rows.map(r => {
              const firstKey = Object.keys(r)[0];
              return r[firstKey];
            });
          }
        }
        
        if (subValues.length === 0) {
          matches = false;
        } else {
          const results = subValues.map(subVal => {
            let valL = actualVal;
            let valR = subVal;
            if (typeof valL === 'number' || typeof valR === 'number') {
              const numL = Number(valL);
              const numR = Number(valR);
              if (!isNaN(numL) && !isNaN(numR)) {
                valL = numL;
                valR = numR;
              }
            }
            
            if (operator === '=') return valL === valR;
            if (operator === '>') return valL > valR;
            if (operator === '<') return valL < valR;
            if (operator === '>=') return valL >= valR;
            if (operator === '<=') return valL <= valR;
            if (operator === '<>' || operator === '!=') return valL !== valR;
            return false;
          });
          
          matches = isAny ? results.some(r => r) : results.every(r => r);
        }
      } else {
        // Standard relational operators
        let targetCompareVal: any = rawValue;
        let cleanRaw = rawValue.trim();
        if (cleanRaw.toUpperCase().startsWith('DATE ')) {
          cleanRaw = cleanRaw.substring(5).trim();
        }

        if (cleanRaw.toUpperCase().includes('(SELECT')) {
          let subquerySql = '';
          if (cleanRaw.startsWith('(') && cleanRaw.endsWith(')')) {
            subquerySql = cleanRaw.slice(1, -1).trim();
          } else {
            const firstParen = cleanRaw.indexOf('(');
            const lastParen = cleanRaw.lastIndexOf(')');
            if (firstParen !== -1 && lastParen !== -1) {
              subquerySql = cleanRaw.substring(firstParen + 1, lastParen).trim();
            } else {
              subquerySql = cleanRaw;
            }
          }
          
          if (subquerySql) {
            const subResult = parseAndExecuteSQL(subquerySql, originalRow);
            if (subResult.success && subResult.rows.length > 0) {
              const firstRow = subResult.rows[0];
              const firstKey = Object.keys(firstRow)[0];
              targetCompareVal = firstRow[firstKey];
            }
          }
        } else if (typeof actualVal === 'number') {
          const parsedNum = Number(cleanRaw.replace(/['"]/g, ''));
          if (!isNaN(parsedNum)) {
            targetCompareVal = parsedNum;
          }
        } else {
          targetCompareVal = cleanRaw.replace(/^'|'$/g, '').replace(/^"|"$/g, '');
        }

        let valL = actualVal;
        let valR = targetCompareVal;
        if (typeof valL === 'number' || typeof valR === 'number') {
          const numL = Number(valL);
          const numR = Number(valR);
          if (!isNaN(numL) && !isNaN(numR)) {
            valL = numL;
            valR = numR;
          }
        }

        if (operator === '=') {
          matches = valL === valR;
        } else if (operator === '>') {
          matches = valL > valR;
        } else if (operator === '<') {
          matches = valL < valR;
        } else if (operator === '>=') {
          matches = valL >= valR;
        } else if (operator === '<=') {
          matches = valL <= valR;
        } else if (operator === '<>' || operator === '!=') {
          matches = valL !== valR;
        }
      }

      const rowLabel = `${originalRow.first_name || originalRow[tableColumns[0]] || 'Row ' + rIndex}`;
      steps.push({
        type: 'scan_row',
        message: `Reading row: ${rowLabel}. Checking if ${column} (${actualVal}) ${operator} ${rawValue}...`,
        currentRowIndex: rIndex,
        matched: matches
      });

      if (matches) {
        filteredRows.push(originalRow);
        steps.push({
          type: 'keep_row',
          message: `↳ MATCH! Keeping row for "${rowLabel}".`,
          currentRowIndex: rIndex,
          tempRows: [...filteredRows]
        });
      } else {
        steps.push({
          type: 'filter_row',
          message: `↳ NO MATCH. Discarding row for "${rowLabel}".`,
          currentRowIndex: rIndex,
          tempRows: [...filteredRows]
        });
      }
    }
  } else {
    // No WHERE
    steps.push({
      type: 'scan_row',
      message: "No WHERE condition specified. SQL opens the table and keeps all records.",
      tempRows: [...filteredRows]
    });
  }

  // --- STAGE 2: GROUP BY groupings ---
  const hasAggregates = colSegments.some(seg => isAggregateExpression(seg.column));
  const groupByCols = groupByClause ? groupByClause.split(',').map(s => s.trim().toLowerCase()) : [];
  
  const groups: Record<string, any[]> = {};
  if (groupByCols.length > 0 || hasAggregates) {
    if (groupByCols.length > 0) {
      filteredRows.forEach(row => {
        const groupKey = groupByCols.map(col => String(row[col] ?? '')).join('|');
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(row);
      });
      steps.push({
        type: 'scan_row',
        message: `Applying GROUP BY on: ${groupByCols.join(', ')}. Formed ${Object.keys(groups).length} distinct groups.`,
        tempRows: [...filteredRows]
      });
    } else {
      // Aggregates with no GROUP BY collapsed to one group
      groups['all'] = filteredRows;
    }
  }

  // --- STAGE 3: SELECT columns projection and AS aliases ---
  let projectedRows: Record<string, any>[] = [];
  const outputHeaders: string[] = [];

  if (isWildcard) {
    const uniquePlainHeaders = new Set<string>();
    tableColumns.forEach(col => {
      if (!col.includes('.')) uniquePlainHeaders.add(col);
    });
    outputHeaders.push(...Array.from(uniquePlainHeaders));

    projectedRows = filteredRows.map(row => {
      const newRow: Record<string, any> = {};
      outputHeaders.forEach(col => {
        newRow[col] = getRowValue(row, col);
      });
      Object.defineProperty(newRow, '__originalRow', {
        value: row,
        enumerable: false,
        writable: true
      });
      return newRow;
    });
  } else {
    colSegments.forEach(seg => {
      const header = seg.alias || seg.column;
      outputHeaders.push(header);
    });

    if (groupByCols.length > 0 || hasAggregates) {
      projectedRows = Object.values(groups).map(groupRows => {
        const newRow: Record<string, any> = {};
        colSegments.forEach(seg => {
          const header = seg.alias || seg.column;
          if (isAggregateExpression(seg.column)) {
            newRow[header] = evaluateAggregate(seg.column, groupRows);
          } else {
            newRow[header] = evaluateScalarExpression(seg.column, groupRows[0] || {});
          }
        });
        Object.defineProperty(newRow, '__groupRows', {
          value: groupRows,
          enumerable: false,
          writable: true
        });
        Object.defineProperty(newRow, '__originalRow', {
          value: groupRows[0] || {},
          enumerable: false,
          writable: true
        });
        return newRow;
      });
    } else {
      projectedRows = filteredRows.map(row => {
        const newRow: Record<string, any> = {};
        colSegments.forEach(seg => {
          const header = seg.alias || seg.column;
          newRow[header] = evaluateScalarExpression(seg.column, row);
        });
        Object.defineProperty(newRow, '__originalRow', {
          value: row,
          enumerable: false,
          writable: true
        });
        return newRow;
      });
    }
  }

  // --- STAGE 3.5: Window Functions Evaluation ---
  colSegments.forEach(seg => {
    if (seg.column.toUpperCase().includes('OVER')) {
      const header = seg.alias || seg.column;
      const winMatch = seg.column.match(/(RANK|DENSE_RANK)\s*\(\s*\)\s*OVER\s*\(\s*ORDER\s+BY\s+([a-zA-Z0-9_.]+)(?:\s+(ASC|DESC))?\s*\)/i);
      if (winMatch) {
        const funcType = winMatch[1].toUpperCase();
        const sortCol = winMatch[2];
        const isDesc = winMatch[3] ? winMatch[3].toUpperCase() === 'DESC' : false;
        const isDense = funcType === 'DENSE_RANK';

        // Sort the projected rows temporarily to compute ranks
        projectedRows.sort((a, b) => {
          const valA = getRowValue(a['__originalRow'] || a, sortCol);
          const valB = getRowValue(b['__originalRow'] || b, sortCol);
          if (valA === valB) return 0;
          if (valA == null) return 1;
          if (valB == null) return -1;
          let comp = 0;
          if (typeof valA === 'number' && typeof valB === 'number') {
            comp = valA < valB ? -1 : 1;
          } else {
            comp = String(valA).localeCompare(String(valB));
          }
          return isDesc ? -comp : comp;
        });

        // Assign ranks
        let currentRank = 1;
        let currentDenseRank = 1;
        let previousValue: any = null;
        let count = 0;

        projectedRows.forEach((row, index) => {
          const val = getRowValue(row['__originalRow'] || row, sortCol);
          count++;
          if (index > 0) {
            if (val !== previousValue) {
              currentRank = count;
              currentDenseRank++;
            }
          }
          previousValue = val;
          row[header] = isDense ? currentDenseRank : currentRank;
        });
      } else {
        // Fallback rank calculation if no specific order is found
        const header = seg.alias || seg.column;
        projectedRows.forEach((row, index) => {
          row[header] = index + 1;
        });
      }
    }
  });

  steps.push({
    type: 'project_columns',
    message: isWildcard 
      ? `Selecting all columns (*): ${outputHeaders.join(', ')}.`
      : `Projecting only the requested columns: ${colSegments.map(s => s.column + (s.alias ? ` AS "${s.alias}"` : '')).join(', ')}.`,
    tempRows: [...projectedRows],
    targetColumns: outputHeaders
  });

  // --- STAGE 4: HAVING filter ---
  if (havingClause && (groupByCols.length > 0 || hasAggregates)) {
    const parsedHaving = parseWhereClause(havingClause);
    if (parsedHaving) {
      const { column, operator, rawValue } = parsedHaving;
      const compareVal = Number(rawValue.replace(/['"]/g, ''));
      
      projectedRows = projectedRows.filter(row => {
        const foundSeg = colSegments.find(seg => 
          seg.column.replace(/\s+/g, '').toUpperCase() === column.replace(/\s+/g, '').toUpperCase() || 
          (seg.alias && seg.alias.toUpperCase() === column.toUpperCase())
        );
        const header = foundSeg?.alias || foundSeg?.column || column;
        
        let actualVal: any;
        if (row[header] !== undefined) {
          actualVal = Number(row[header]);
        } else if (isAggregateExpression(column) && row['__groupRows']) {
          actualVal = Number(evaluateAggregate(column, row['__groupRows']));
        } else {
          actualVal = Number(row[header]);
        }

        if (isNaN(actualVal)) return true;
        
        if (operator === '=') return actualVal === compareVal;
        if (operator === '>') return actualVal > compareVal;
        if (operator === '<') return actualVal < compareVal;
        if (operator === '>=') return actualVal >= compareVal;
        if (operator === '<=') return actualVal <= compareVal;
        if (operator === '<>' || operator === '!=') return actualVal !== compareVal;
        return true;
      });

      steps.push({
        type: 'project_columns',
        message: `Applying HAVING filter: ${havingClause}. Remaining rows: ${projectedRows.length}.`,
        tempRows: [...projectedRows],
        targetColumns: outputHeaders
      });
    }
  }

  // --- STAGE 5: DISTINCT deduplication ---
  if (isDistinct) {
    const uniqueRows: Record<string, any>[] = [];
    const seenHashes = new Set<string>();

    projectedRows.forEach(row => {
      const hash = JSON.stringify(row);
      if (!seenHashes.has(hash)) {
        seenHashes.add(hash);
        uniqueRows.push(row);
      }
    });

    projectedRows = uniqueRows;
    steps.push({
      type: 'project_columns',
      message: `Applying DISTINCT deduplication: collapsed duplicate rows. Remaining unique records: ${projectedRows.length}.`,
      tempRows: [...projectedRows],
      targetColumns: outputHeaders
    });
  }

  // --- STAGE 6: ORDER BY sorting ---
  let sortedByHeader = '';
  if (orderByClause) {
    const sortSegments = orderByClause.split(',').map(s => s.trim());
    const sorts = sortSegments.map(seg => {
      const parts = seg.split(/\s+/);
      const colRaw = parts[0];
      const isDesc = parts[1] && parts[1].toUpperCase() === 'DESC';
      return { column: colRaw, isDesc, rawName: colRaw };
    });

    projectedRows.sort((a, b) => {
      for (const sort of sorts) {
        const valA = getSortValue(a, sort.column);
        const valB = getSortValue(b, sort.column);
        
        if (valA === valB) continue;
        if (valA == null) return 1;
        if (valB == null) return -1;
        
        let comp = 0;
        if (typeof valA === 'number' && typeof valB === 'number') {
          comp = valA < valB ? -1 : 1;
        } else {
          comp = String(valA).localeCompare(String(valB));
        }
        return sort.isDesc ? -comp : comp;
      }
      return 0;
    });

    sortedByHeader = sorts.map(s => s.rawName + (s.isDesc ? ' DESC' : '')).join(', ');
    steps.push({
      type: 'sort_results',
      message: `Applying ORDER BY: Sorted results by "${sortedByHeader}".`,
      tempRows: [...projectedRows],
      targetColumns: outputHeaders
    });
  }

  steps.push({
    type: 'complete',
    message: `Query executed successfully! Returned ${projectedRows.length} rows and ${outputHeaders.length} columns.`,
    tempRows: [...projectedRows],
    targetColumns: outputHeaders
  });

  return {
    success: true,
    columns: outputHeaders,
    rows: projectedRows,
    steps
  };
}

// Helpers
function findClauseIndices(sql: string): Record<string, number> {
  const upper = sql.toUpperCase();
  const keywords = ['SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY'];
  const result: Record<string, number> = {};
  
  let insideSingle = false;
  let insideDouble = false;
  let parenDepth = 0;
  
  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (char === "'" && !insideDouble) {
      insideSingle = !insideSingle;
    } else if (char === '"' && !insideSingle) {
      insideDouble = !insideDouble;
    } else if (char === '(' && !insideSingle && !insideDouble) {
      parenDepth++;
    } else if (char === ')' && !insideSingle && !insideDouble) {
      parenDepth--;
    }
    
    if (!insideSingle && !insideDouble && parenDepth === 0) {
      for (const kw of keywords) {
        if (upper.substring(i).startsWith(kw)) {
          const nextChar = upper[i + kw.length];
          const prevChar = i > 0 ? upper[i - 1] : '';
          const isPrevWordBoundary = !prevChar || /[^A-Z0-9_]/.test(prevChar);
          const isNextWordBoundary = !nextChar || /[^A-Z0-9_]/.test(nextChar);
          if (isPrevWordBoundary && isNextWordBoundary) {
            if (result[kw] === undefined) {
              result[kw] = i;
            }
          }
        }
      }
    }
  }
  return result;
}

function parseColumnSegment(seg: string): { raw: string; column: string; alias?: string } {
  const upperSeg = seg.toUpperCase();
  const asIdx = upperSeg.lastIndexOf(' AS ');
  
  if (asIdx !== -1) {
    const column = seg.substring(0, asIdx).trim();
    const alias = seg.substring(asIdx + 4).trim().replace(/^"|"$/g, '');
    return { raw: seg, column, alias };
  }

  let splitIdx = -1;
  let insideQuotes = false;
  let parenDepth = 0;
  
  for (let i = seg.length - 1; i >= 0; i--) {
    const char = seg[i];
    if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === ')' && !insideQuotes) {
      parenDepth++;
    } else if (char === '(' && !insideQuotes) {
      parenDepth--;
    }
    
    if (char === ' ' && !insideQuotes && parenDepth === 0) {
      splitIdx = i;
      break;
    }
  }

  if (splitIdx !== -1) {
    const column = seg.substring(0, splitIdx).trim();
    const alias = seg.substring(splitIdx + 1).trim().replace(/^"|"$/g, '');
    return { raw: seg, column, alias };
  }

  return { raw: seg, column: seg };
}

function getUnderlyingColumn(expr: string): string {
  const trimmed = expr.trim();
  if (!trimmed.includes('(')) {
    return trimmed;
  }
  const match = trimmed.match(/\w+\s*\(\s*([^,)]+)/);
  if (match) {
    return match[1].trim();
  }
  return trimmed;
}

function isAggregateExpression(expr: string): boolean {
  const upper = expr.trim().toUpperCase();
  return upper.startsWith('COUNT(') || 
         upper.startsWith('SUM(') || 
         upper.startsWith('AVG(') || 
         upper.startsWith('MAX(') || 
         upper.startsWith('MIN(');
}

function evaluateAggregate(expr: string, rows: any[]): any {
  const upper = expr.trim().toUpperCase();
  const underlying = getUnderlyingColumn(expr).toLowerCase();
  
  if (upper.startsWith('COUNT(')) {
    if (underlying === '*') {
      return rows.length;
    }
    return rows.filter(r => r[underlying] != null).length;
  }
  
  const values = rows
    .map(r => r[underlying])
    .filter(v => v != null && !isNaN(Number(v)))
    .map(v => Number(v));
    
  if (upper.startsWith('SUM(')) {
    return values.reduce((sum, v) => sum + v, 0);
  }
  if (upper.startsWith('AVG(')) {
    if (values.length === 0) return 0;
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    return Math.round(avg * 100) / 100;
  }
  if (upper.startsWith('MAX(')) {
    if (values.length === 0) return null;
    return Math.max(...values);
  }
  if (upper.startsWith('MIN(')) {
    if (values.length === 0) return null;
    return Math.min(...values);
  }
  
  return null;
}

function evaluateScalarExpression(expr: string, row: any): any {
  const trimmed = expr.trim();
  
  // 1. Subquery in SELECT list
  if (trimmed.startsWith('(') && trimmed.endsWith(')') && trimmed.toUpperCase().includes('SELECT')) {
    const inner = trimmed.slice(1, -1);
    const subResult = parseAndExecuteSQL(inner, row);
    if (subResult.success && subResult.rows.length > 0) {
      const firstRow = subResult.rows[0];
      const firstKey = Object.keys(firstRow)[0];
      return firstRow[firstKey];
    }
    return null;
  }
  
  // 2. String Concatenation ||
  if (trimmed.includes('||')) {
    const parts = trimmed.split('||').map(p => p.trim());
    let result = '';
    for (const part of parts) {
      if (part.startsWith("'") && part.endsWith("'")) {
        result += part.slice(1, -1);
      } else if (part.startsWith('"') && part.endsWith('"')) {
        result += part.slice(1, -1);
      } else {
        const colVal = getRowValue(row, part);
        result += colVal != null ? String(colVal) : '';
      }
    }
    return result;
  }

  // 3. Standard functions
  const match = trimmed.match(/^(\w+)\s*\(([\s\S]*)\)$/i);
  if (match) {
    const funcName = match[1].toUpperCase();
    const argsStr = match[2].trim();
    
    const args: string[] = [];
    let currentArg = '';
    let insideSingle = false;
    let insideDouble = false;
    
    for (let i = 0; i < argsStr.length; i++) {
      const char = argsStr[i];
      if (char === "'" && !insideDouble) {
        insideSingle = !insideSingle;
      } else if (char === '"' && !insideSingle) {
        insideDouble = !insideDouble;
      }
      
      if (char === ',' && !insideSingle && !insideDouble) {
        args.push(currentArg.trim());
        currentArg = '';
      } else {
        currentArg += char;
      }
    }
    if (currentArg.trim()) {
      args.push(currentArg.trim());
    }
    
    const firstArgResolved = (arg: string) => {
      if (arg.startsWith("'") && arg.endsWith("'")) {
        return arg.slice(1, -1);
      }
      if (arg.startsWith('"') && arg.endsWith('"')) {
        return arg.slice(1, -1);
      }
      if (!isNaN(Number(arg))) {
        return Number(arg);
      }
      return getRowValue(row, arg);
    };

    if (funcName === 'COALESCE') {
      for (const arg of args) {
        const resolved = firstArgResolved(arg);
        if (resolved != null) return resolved;
      }
      return null;
    }

    const val = firstArgResolved(args[0]);

    if (funcName === 'UPPER') {
      return val != null ? String(val).toUpperCase() : null;
    }
    if (funcName === 'LOWER') {
      return val != null ? String(val).toLowerCase() : null;
    }
    if (funcName === 'INITCAP') {
      if (val == null) return null;
      const str = String(val).toLowerCase();
      return str.replace(/\b\w/g, c => c.toUpperCase());
    }
    if (funcName === 'LENGTH') {
      return val != null ? String(val).length : 0;
    }
    if (funcName === 'SUBSTR') {
      if (val == null) return null;
      const start = args[1] ? parseInt(args[1], 10) - 1 : 0;
      const len = args[2] ? parseInt(args[2], 10) : undefined;
      return String(val).substring(start, len !== undefined ? start + len : undefined);
    }
    if (funcName === 'ROUND') {
      if (val == null) return null;
      const num = Number(val);
      const decimals = args[1] ? parseInt(args[1], 10) : 0;
      if (isNaN(num)) return val;
      return Number(num.toFixed(decimals));
    }
    if (funcName === 'NVL') {
      if (val != null) return val;
      const fallback = args[1] ? args[1].trim() : '';
      if (fallback.startsWith("'") && fallback.endsWith("'")) {
        return fallback.slice(1, -1);
      }
      return Number(fallback);
    }
    
    return val;
  }
  
  // 4. Fallback to basic row value
  return getRowValue(row, trimmed);
}

function parseWhereClause(clause: string): { column: string; operator: string; rawValue: string } | null {
  const upper = clause.trim().toUpperCase();

  if (upper.startsWith('EXISTS') || upper.startsWith('NOT EXISTS')) {
    const isNot = upper.startsWith('NOT EXISTS');
    const subqueryStr = clause.substring(isNot ? 10 : 6).trim();
    return {
      column: 'EXISTS',
      operator: isNot ? 'NOT EXISTS' : 'EXISTS',
      rawValue: subqueryStr
    };
  }

  // Helper to find substring only at parenthesis depth 0
  const findIndexAtDepth0 = (search: string): number => {
    let insideSingle = false;
    let insideDouble = false;
    let parenDepth = 0;
    const upperSearch = search.toUpperCase();
    
    for (let i = 0; i < clause.length; i++) {
      const char = clause[i];
      if (char === "'" && !insideDouble) {
        insideSingle = !insideSingle;
      } else if (char === '"' && !insideSingle) {
        insideDouble = !insideDouble;
      } else if (char === '(' && !insideSingle && !insideDouble) {
        parenDepth++;
      } else if (char === ')' && !insideSingle && !insideDouble) {
        parenDepth--;
      }
      
      if (!insideSingle && !insideDouble && parenDepth === 0) {
        if (clause.substring(i).toUpperCase().startsWith(upperSearch)) {
          return i;
        }
      }
    }
    return -1;
  };

  const isNotNullIdx = findIndexAtDepth0(' IS NOT NULL');
  if (isNotNullIdx !== -1) {
    return {
      column: clause.substring(0, isNotNullIdx).trim(),
      operator: 'IS NOT NULL',
      rawValue: ''
    };
  }

  const isNullIdx = findIndexAtDepth0(' IS NULL');
  if (isNullIdx !== -1) {
    return {
      column: clause.substring(0, isNullIdx).trim(),
      operator: 'IS NULL',
      rawValue: ''
    };
  }

  const betweenIdx = findIndexAtDepth0(' BETWEEN ');
  if (betweenIdx !== -1) {
    return {
      column: clause.substring(0, betweenIdx).trim(),
      operator: 'BETWEEN',
      rawValue: clause.substring(betweenIdx + 9).trim()
    };
  }

  const likeIdx = findIndexAtDepth0(' LIKE ');
  if (likeIdx !== -1) {
    return {
      column: clause.substring(0, likeIdx).trim(),
      operator: 'LIKE',
      rawValue: clause.substring(likeIdx + 6).trim()
    };
  }

  const inIdx = findIndexAtDepth0(' IN ');
  if (inIdx !== -1) {
    return {
      column: clause.substring(0, inIdx).trim(),
      operator: 'IN',
      rawValue: clause.substring(inIdx + 4).trim()
    };
  }

  const operators = ['<=', '>=', '<>', '!=', '=', '>', '<'];
  let operator = '';
  let opIdx = -1;

  for (const op of operators) {
    const idx = findIndexAtDepth0(op);
    if (idx !== -1) {
      operator = op;
      opIdx = idx;
      break;
    }
  }

  if (opIdx === -1) {
    return null;
  }

  const column = clause.substring(0, opIdx).trim();
  const rawValue = clause.substring(opIdx + operator.length).trim();

  if (!column || !rawValue) {
    return null;
  }

  return { column, operator, rawValue };
}

export function simulatePLSQL(rawSql: string): SQLRunnerResult {
  const steps: QueryExecutionStep[] = [];
  const lines: string[] = [];
  
  steps.push({
    type: 'open_table',
    message: "Initializing PL/SQL Anonymous Block context.",
    tempRows: []
  });

  // Extract DECLARE part and BEGIN/END part
  const upper = rawSql.trim().toUpperCase();
  const declareIdx = upper.indexOf('DECLARE');
  const beginIdx = upper.indexOf('BEGIN');
  const endIdx = upper.lastIndexOf('END');

  const variables: Record<string, string> = {};

  if (declareIdx !== -1 && beginIdx !== -1) {
    const declareSection = rawSql.substring(declareIdx + 7, beginIdx).trim();
    const declLines = declareSection.split(';');
    for (const dLine of declLines) {
      const trimmed = dLine.trim();
      if (!trimmed) continue;
      // match something like v_msg VARCHAR2(50) := 'Hello, PL/SQL!'
      const match = trimmed.match(/(\w+)\s+[\w\(\)]+\s*:=\s*([^;]+)/);
      if (match) {
        const varName = match[1].trim();
        let varVal = match[2].trim();
        // remove single quotes if it's a string literal
        if (varVal.startsWith("'") && varVal.endsWith("'")) {
          varVal = varVal.slice(1, -1);
        }
        variables[varName] = varVal;
        steps.push({
          type: 'scan_row',
          message: `[DECLARE] Declared variable "${varName}" initialized with value: "${varVal}"`,
          tempRows: []
        });
      }
    }
  }

  // Parse BEGIN section or Loop block
  let executionSection = '';
  let hasExecution = false;
  let sectionName = 'Anonymous Block';
  
  if (beginIdx !== -1) {
    const endPosition = endIdx !== -1 ? endIdx : rawSql.length;
    executionSection = rawSql.substring(beginIdx + 5, endPosition).trim();
    hasExecution = true;
    sectionName = 'BEGIN ... END block';
  } else if (upper.startsWith('<<') || upper.includes('LOOP') || upper.includes('DBMS_OUTPUT')) {
    executionSection = rawSql;
    hasExecution = true;
    sectionName = 'Label / Loop block';
  }

  if (hasExecution) {
    steps.push({
      type: 'project_columns',
      message: `Entering execution block (${sectionName})`,
      tempRows: []
    });

    // Check if we have FOR loop declarations to simulate nested iteration
    const loopRegex = /FOR\s+(\w+)\s+IN\s+(\d+)\.\.(\d+)\s+LOOP/gi;
    const loops: { varName: string; start: number; end: number }[] = [];
    let loopMatch;
    while ((loopMatch = loopRegex.exec(executionSection)) !== null) {
      loops.push({
        varName: loopMatch[1].toLowerCase(),
        start: parseInt(loopMatch[2], 10),
        end: parseInt(loopMatch[3], 10)
      });
    }

    const evaluateDBMSOutputLocal = (vars: Record<string, string>) => {
      const dbmsRegex = /DBMS_OUTPUT\s*\.\s*PUT_LINE\s*\(\s*([^)]+)\s*\)/gi;
      let match;
      while ((match = dbmsRegex.exec(executionSection)) !== null) {
        const expr = match[1].trim();
        const parts = expr.split('||');
        let evaluated = '';
        
        for (const part of parts) {
          const trimmedPart = part.trim();
          if (trimmedPart.startsWith("'") && trimmedPart.endsWith("'")) {
            evaluated += trimmedPart.slice(1, -1);
          } else {
            const foundVarKey = Object.keys(vars).find(k => k.toLowerCase() === trimmedPart.toLowerCase());
            if (foundVarKey) {
              evaluated += vars[foundVarKey];
            } else {
              evaluated += trimmedPart;
            }
          }
        }
        lines.push(evaluated);
        steps.push({
          type: 'keep_row',
          message: `[DBMS_OUTPUT] Printed to buffer: "${evaluated}"`,
          tempRows: []
        });
      }
    };

    if (loops.length === 2) {
      const l1 = loops[0];
      const l2 = loops[1];
      for (let i = l1.start; i <= l1.end; i++) {
        for (let j = l2.start; j <= l2.end; j++) {
          const runVars = { ...variables, [l1.varName]: String(i), [l2.varName]: String(j) };
          evaluateDBMSOutputLocal(runVars);
        }
      }
    } else if (loops.length === 1) {
      const l = loops[0];
      for (let i = l.start; i <= l.end; i++) {
        const runVars = { ...variables, [l.varName]: String(i) };
        evaluateDBMSOutputLocal(runVars);
      }
    } else {
      evaluateDBMSOutputLocal(variables);
    }

    if (lines.length === 0) {
      lines.push("PL/SQL procedure successfully completed.");
      steps.push({
        type: 'keep_row',
        message: "No DBMS_OUTPUT statements captured.",
        tempRows: []
      });
    }
  } else {
    // If it's an administrative or DML/DDL statement
    const firstWord = upper.split(/\s+/)[0];
    if (['CREATE', 'EXPLAIN', 'ALTER', 'DROP', 'INSERT', 'UPDATE', 'DELETE'].includes(firstWord)) {
      let msg = "Procedural object created successfully.";
      let detail = "Object compilation successful in Oracle Schema.";
      if (firstWord === 'EXPLAIN') {
        msg = "Explain plan successfully generated.";
        detail = "Optimizer execution path computed.";
      } else if (firstWord === 'ALTER') {
        msg = "Database object altered successfully.";
        detail = "Schema configuration altered.";
      } else if (firstWord === 'DROP') {
        msg = "Database object dropped successfully.";
        detail = "Schema object removed.";
      } else if (['INSERT', 'UPDATE', 'DELETE'].includes(firstWord)) {
        msg = "DML execution completed successfully.";
        detail = "Rows affected and schema changes applied to isolated sandbox.";
      }
      
      lines.push(msg);
      steps.push({
        type: 'keep_row',
        message: detail,
        tempRows: []
      });
    } else {
      return {
        success: false,
        error: "Syntax Error: PL/SQL block must contain a BEGIN keyword.",
        columns: [],
        rows: [],
        steps: []
      };
    }
  }

  steps.push({
    type: 'complete',
    message: "PL/SQL Block execution finished successfully.",
    tempRows: lines.map(l => ({ OUTPUT_LINE: l })),
    targetColumns: ['OUTPUT_LINE']
  });

  return {
    success: true,
    columns: ['OUTPUT_LINE'],
    rows: lines.map(l => ({ OUTPUT_LINE: l })),
    steps
  };
}

interface JoinSegment {
  type: 'INNER' | 'LEFT' | 'CROSS' | 'FULL';
  table: string;
  alias: string;
  onCondition?: string;
}

interface ParsedFrom {
  baseTable: string;
  baseAlias: string;
  joins: JoinSegment[];
}

function parseFromClauseAndJoin(fromStr: string): ParsedFrom | null {
  const trimmed = fromStr.trim();
  const joinIdx = trimmed.search(/\b(JOIN|LEFT|CROSS|FULL|INNER)\b/i);
  if (joinIdx === -1) {
    const parts = trimmed.split(/\s+/);
    const baseTable = parts[0];
    const baseAlias = parts[1] || baseTable;
    return { baseTable, baseAlias, joins: [] };
  }
  
  const basePart = trimmed.substring(0, joinIdx).trim();
  const baseParts = basePart.split(/\s+/);
  const baseTable = baseParts[0];
  const baseAlias = baseParts[1] || baseTable;
  
  const joinsPart = trimmed.substring(joinIdx).trim();
  const joins: JoinSegment[] = [];
  
  const joinRegex = /(?:(LEFT\s+OUTER|LEFT|CROSS|FULL\s+OUTER|FULL|INNER)?\s*JOIN)\s+([a-zA-Z0-9_]+)(?:\s+([a-zA-Z0-9_]+))?(?:\s+ON\s+([\s\S]+?))?(?=\s*(?:(?:LEFT|CROSS|FULL|INNER)?\s*JOIN|$))/gi;
  
  let match;
  while ((match = joinRegex.exec(joinsPart)) !== null) {
    const modifier = (match[1] || '').toUpperCase();
    const table = match[2];
    const alias = match[3] || table;
    const onCondition = match[4] ? match[4].trim() : undefined;
    
    let type: 'INNER' | 'LEFT' | 'CROSS' | 'FULL' = 'INNER';
    if (modifier.includes('LEFT')) {
      type = 'LEFT';
    } else if (modifier.includes('CROSS')) {
      type = 'CROSS';
    } else if (modifier.includes('FULL')) {
      type = 'FULL';
    }
    
    joins.push({ type, table, alias, onCondition });
  }
  
  return { baseTable, baseAlias, joins };
}

function executeJoins(parsedFrom: ParsedFrom, steps: QueryExecutionStep[]): { success: boolean; error?: string; tableName: string; columns: string[]; rows: any[] } {
  const baseDbTable = SCHEMAS_DATABASE[parsedFrom.baseTable.toLowerCase()];
  if (!baseDbTable) {
    const knownTables = Object.keys(SCHEMAS_DATABASE).join(', ');
    return {
      success: false,
      error: `Table Error: Table "${parsedFrom.baseTable}" does not exist in our database. Did you mean: ${knownTables}?`,
      tableName: '',
      columns: [],
      rows: []
    };
  }
  
  steps.push({
    type: 'open_table',
    message: `Database locates and opens base table "${baseDbTable.table_name}" (${baseDbTable.rows.length} rows) and prepares to execute Joins.`,
    tempRows: [...baseDbTable.rows]
  });
  
  let currentRows = baseDbTable.rows.map(row => {
    const newRow: Record<string, any> = {};
    baseDbTable.columns.forEach(col => {
      const lowerCol = col.toLowerCase();
      newRow[lowerCol] = row[lowerCol];
      newRow[`${parsedFrom.baseTable.toLowerCase()}.${lowerCol}`] = row[lowerCol];
      newRow[`${parsedFrom.baseAlias.toLowerCase()}.${lowerCol}`] = row[lowerCol];
    });
    return newRow;
  });
  
  const columnsSet = new Set<string>();
  baseDbTable.columns.forEach(col => {
    columnsSet.add(col.toLowerCase());
    columnsSet.add(`${parsedFrom.baseTable.toLowerCase()}.${col.toLowerCase()}`);
    columnsSet.add(`${parsedFrom.baseAlias.toLowerCase()}.${col.toLowerCase()}`);
  });
  
  for (const join of parsedFrom.joins) {
    const rightDbTable = SCHEMAS_DATABASE[join.table.toLowerCase()];
    if (!rightDbTable) {
      const knownTables = Object.keys(SCHEMAS_DATABASE).join(', ');
      return {
        success: false,
        error: `Table Error: Joined table "${join.table}" does not exist. Did you mean: ${knownTables}?`,
        tableName: '',
        columns: [],
        rows: []
      };
    }
    
    rightDbTable.columns.forEach(col => {
      columnsSet.add(col.toLowerCase());
      columnsSet.add(`${join.table.toLowerCase()}.${col.toLowerCase()}`);
      columnsSet.add(`${join.alias.toLowerCase()}.${col.toLowerCase()}`);
    });
    
    const joinedRows: Record<string, any>[] = [];
    const matchedRightIndices = new Set<number>();
    
    for (const leftRow of currentRows) {
      let matchedAny = false;
      
      for (let rIdx = 0; rIdx < rightDbTable.rows.length; rIdx++) {
        const rightRowRaw = rightDbTable.rows[rIdx];
        
        const tempCombined: Record<string, any> = { ...leftRow };
        rightDbTable.columns.forEach(col => {
          const lowerCol = col.toLowerCase();
          tempCombined[lowerCol] = rightRowRaw[lowerCol];
          tempCombined[`${join.table.toLowerCase()}.${lowerCol}`] = rightRowRaw[lowerCol];
          tempCombined[`${join.alias.toLowerCase()}.${lowerCol}`] = rightRowRaw[lowerCol];
        });
        
        let isMatch = false;
        if (join.type === 'CROSS') {
          isMatch = true;
        } else if (join.onCondition) {
          isMatch = evaluateJoinCondition(join.onCondition, tempCombined);
        }
        
        if (isMatch) {
          matchedAny = true;
          matchedRightIndices.add(rIdx);
          joinedRows.push(tempCombined);
        }
      }
      
      if (!matchedAny && (join.type === 'LEFT' || join.type === 'FULL')) {
        const nullFilled = { ...leftRow };
        rightDbTable.columns.forEach(col => {
          const lowerCol = col.toLowerCase();
          nullFilled[lowerCol] = null;
          nullFilled[`${join.table.toLowerCase()}.${lowerCol}`] = null;
          nullFilled[`${join.alias.toLowerCase()}.${lowerCol}`] = null;
        });
        joinedRows.push(nullFilled);
      }
    }
    
    if (join.type === 'FULL') {
      for (let rIdx = 0; rIdx < rightDbTable.rows.length; rIdx++) {
        if (!matchedRightIndices.has(rIdx)) {
          const rightRowRaw = rightDbTable.rows[rIdx];
          const nullFilledLeft: Record<string, any> = {};
          
          if (currentRows.length > 0) {
            Object.keys(currentRows[0]).forEach(key => {
              nullFilledLeft[key] = null;
            });
          }
          
          rightDbTable.columns.forEach(col => {
            const lowerCol = col.toLowerCase();
            nullFilledLeft[lowerCol] = rightRowRaw[lowerCol];
            nullFilledLeft[`${join.table.toLowerCase()}.${lowerCol}`] = rightRowRaw[lowerCol];
            nullFilledLeft[`${join.alias.toLowerCase()}.${lowerCol}`] = rightRowRaw[lowerCol];
          });
          joinedRows.push(nullFilledLeft);
        }
      }
    }
    
    steps.push({
      type: 'keep_row',
      message: `Executed ${join.type} JOIN with "${rightDbTable.table_name}" aliased as "${join.alias}". Combined rows size: ${joinedRows.length}.`,
      tempRows: [...joinedRows]
    });
    
    currentRows = joinedRows;
  }
  
  return {
    success: true,
    tableName: baseDbTable.table_name,
    columns: Array.from(columnsSet),
    rows: currentRows
  };
}

function evaluateJoinCondition(cond: string, row: Record<string, any>): boolean {
  const parsed = parseWhereClause(cond);
  if (!parsed) return false;
  
  const { column, operator, rawValue } = parsed;
  const leftVal = getRowValue(row, column);
  
  if (operator === 'BETWEEN') {
    const bounds = rawValue.split(/\s+AND\s+/i);
    if (bounds.length === 2) {
      const low = getRowValue(row, bounds[0]) !== undefined ? getRowValue(row, bounds[0]) : Number(bounds[0].replace(/['"]/g, '').trim());
      const high = getRowValue(row, bounds[1]) !== undefined ? getRowValue(row, bounds[1]) : Number(bounds[1].replace(/['"]/g, '').trim());
      const actualNum = Number(leftVal);
      return !isNaN(actualNum) && actualNum >= Number(low) && actualNum <= Number(high);
    }
    return false;
  }
  
  const rightVal = getRowValue(row, rawValue) !== undefined ? getRowValue(row, rawValue) : rawValue.replace(/^'|'$/g, '').replace(/^"|"$/g, '');
  
  let valL: any = leftVal;
  let valR: any = rightVal;
  
  if (typeof valL === 'number' || typeof valR === 'number') {
    const numL = Number(valL);
    const numR = Number(valR);
    if (!isNaN(numL) && !isNaN(numR)) {
      valL = numL;
      valR = numR;
    }
  }
  
  if (operator === '=') {
    return valL === valR;
  } else if (operator === '>') {
    return valL > valR;
  } else if (operator === '<') {
    return valL < valR;
  } else if (operator === '>=') {
    return valL >= valR;
  } else if (operator === '<=') {
    return valL <= valR;
  } else if (operator === '<>' || operator === '!=') {
    return valL !== valR;
  }
  
  return false;
}

function getRowValue(row: Record<string, any>, colName: string): any {
  const lowerCol = colName.toLowerCase().trim();
  
  if (lowerCol.includes('.')) {
    if (row[lowerCol] !== undefined) return row[lowerCol];
    const parts = lowerCol.split('.');
    const tbl = parts[0];
    const col = parts[1];
    
    const foundKey = Object.keys(row).find(k => {
      const kParts = k.toLowerCase().split('.');
      return kParts.length === 2 && kParts[1] === col && (kParts[0] === tbl || kParts[0] === tbl);
    });
    if (foundKey) return row[foundKey];
    return undefined;
  }
  
  if (row[lowerCol] !== undefined) return row[lowerCol];
  
  const suffix = `.${lowerCol}`;
  const foundSuffixKey = Object.keys(row).find(k => k.toLowerCase().endsWith(suffix));
  if (foundSuffixKey) return row[foundSuffixKey];
  
  return undefined;
}

function getSortValue(row: any, colName: string): any {
  if (row[colName] !== undefined) return row[colName];
  const foundProjKey = Object.keys(row).find(k => k.toLowerCase() === colName.toLowerCase());
  if (foundProjKey !== undefined) return row[foundProjKey];
  const orig = row['__originalRow'];
  if (orig) {
    return getRowValue(orig, colName);
  }
  return undefined;
}
