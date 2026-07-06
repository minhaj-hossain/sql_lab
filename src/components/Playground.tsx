import React, { useState } from 'react';
import { parseAndExecuteSQL, SQLRunnerResult } from '../utils/sqlRunner';
import { SCHEMAS_DATABASE } from '../data/lessons';
import { 
  Database, 
  Play, 
  Terminal, 
  Sparkles,
  ChevronRight,
  ListFilter,
  AlertTriangle
} from 'lucide-react';

export default function Playground() {
  const [query, setQuery] = useState('SELECT first_name, salary FROM employees WHERE salary > 6000;');
  const [result, setResult] = useState<SQLRunnerResult | null>(null);
  const [selectedSchemaTable, setSelectedSchemaTable] = useState('employees');

  const templates = [
    { label: 'All Employees', sql: 'SELECT * FROM employees;' },
    { label: 'High Earners Sorted', sql: 'SELECT first_name, salary FROM employees WHERE salary >= 17000 ORDER BY salary DESC;' },
    { label: 'Unique Departments', sql: 'SELECT DISTINCT department_id FROM employees ORDER BY department_id;' },
    { label: 'Departments Catalog', sql: 'SELECT department_name FROM departments;' },
    { label: 'Jobs with High Limits', sql: 'SELECT job_title, max_salary FROM jobs WHERE max_salary > 10000 ORDER BY max_salary DESC;' }
  ];

  const handleRunQuery = () => {
    const res = parseAndExecuteSQL(query);
    setResult(res);
  };

  const handleLoadTemplate = (sql: string) => {
    setQuery(sql);
    setResult(null);
  };

  const activeSchema = SCHEMAS_DATABASE[selectedSchemaTable];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-24" id="playground-view">
      
      {/* Visual Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Workbench Sandbox</h1>
        <p className="text-sm text-on-surface-variant font-serif italic">
          Draft arbitrary queries, sort, filter, and inspect structural compilation reports.
        </p>
      </div>

      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN 2-GRID: SQL EDITOR & OUTPUTS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Query Editor Box */}
          <div className="bg-[#11151C] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner">
            <div className="h-10 px-4 bg-slate-950 border-b border-slate-900 flex items-center justify-between">
              <span className="text-[9px] font-bold font-mono text-slate-400 tracking-wider">COMPILER SHELL</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-rose-500/80 rounded-full" />
                <div className="w-2 h-2 bg-emerald-500/80 rounded-full" />
              </div>
            </div>

            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-40 p-4 text-xs font-mono text-indigo-200 bg-[#11151C] border-none focus:outline-none focus:ring-0 leading-relaxed resize-none scrollbar-thin"
              id="sandbox-textarea-editor"
            />

            {/* Template Buttons footer */}
            <div className="p-2 bg-slate-950 border-t border-slate-900 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none items-center">
              <span className="text-[8px] font-bold text-slate-500 flex items-center shrink-0 pr-1 select-none uppercase font-mono">templates:</span>
              {templates.map((temp) => (
                <button
                  key={temp.label}
                  onClick={() => handleLoadTemplate(temp.sql)}
                  className="px-2 py-1 rounded border border-slate-850 bg-[#11151C] hover:bg-slate-900 text-[9px] font-medium text-slate-300 transition-all shrink-0 font-mono cursor-pointer"
                >
                  {temp.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Trigger Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant">
            <p className="text-[11px] text-on-surface-variant font-serif italic max-w-sm leading-normal">Remember: Every query block requires a semicolon (;) to compile in standard Oracle PL/SQL environments.</p>
            <button
              onClick={handleRunQuery}
              className="w-full sm:w-auto bg-primary hover:bg-opacity-95 text-white font-mono font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              id="sandbox-run-query-btn"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Compile & Run</span>
            </button>
          </div>

          {/* Output Report Frame */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden min-h-[250px] flex flex-col">
            <div className="h-11 px-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-on-surface uppercase tracking-tight flex items-center gap-1.5">
                <Terminal size={14} className="text-primary" />
                <span>Console Logs</span>
              </span>
              {result && result.success && (
                <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded border border-emerald-200 font-mono font-bold">
                  ✓ SUCCESS • {result.rows.length} rows
                </span>
              )}
            </div>

            <div className="flex-1 p-4 overflow-auto scrollbar-thin">
              {result ? (
                result.success ? (
                  result.rows.length > 0 ? (
                    <table className="w-full text-[11px] font-mono border-collapse" id="sandbox-output-table">
                      <thead>
                        <tr className="border-b border-outline-variant text-left text-on-surface-variant uppercase tracking-wider text-[9px]">
                          {result.columns.map((col) => (
                            <th key={col} className="p-2 font-bold text-on-surface">{col}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="border-b border-outline-variant/30 hover:bg-surface-container-low/40">
                            {result.columns.map((col) => (
                              <td key={col} className="p-2 text-on-surface-variant">
                                {String(row[col])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center text-center text-on-surface-variant space-y-2 font-serif">
                      <ListFilter size={20} className="text-on-surface-variant/60" />
                      <p className="text-xs font-bold text-on-surface">Empty Result Set</p>
                      <p className="text-[11px] italic max-w-xs leading-normal">Your query executed correctly, but no rows matched your filter conditions.</p>
                    </div>
                  )
                ) : (
                  <div className="p-3 rounded-lg border border-rose-200 bg-rose-500/5 text-xs text-rose-600 space-y-1.5 font-mono">
                    <span className="font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider text-rose-700">
                      <AlertTriangle size={13} />
                      <span>Oracle Compilation Error</span>
                    </span>
                    <p className="leading-relaxed bg-surface-container-lowest p-3 rounded border border-outline-variant font-mono text-[10px]">
                      {result.error}
                    </p>
                  </div>
                )
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-center p-8 space-y-2 text-on-surface-variant/60 font-serif">
                  <Database size={20} className="text-primary/60 animate-pulse" />
                  <p className="text-xs font-bold text-on-surface">Console is Idle</p>
                  <p className="text-[11px] italic max-w-xs leading-relaxed">Enter your SQL commands in the terminal and click compile to query the memory database.</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN 1-GRID: SCHEMA INSPECTOR & DICTIONARY */}
        <div className="space-y-6">
          
          {/* Active Database Tables Inspector Catalog */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <Database size={16} className="text-primary" />
              <span>Database Schema Catalog</span>
            </h3>

            {/* Selector list of tables */}
            <div className="flex gap-1.5 border-b border-outline-variant/60 pb-2.5 overflow-x-auto">
              {Object.keys(SCHEMAS_DATABASE).map(tName => (
                <button
                  key={tName}
                  onClick={() => setSelectedSchemaTable(tName)}
                  className={`text-[9px] font-mono font-bold px-2 py-1 rounded uppercase tracking-wider transition-all border cursor-pointer ${
                    selectedSchemaTable === tName 
                      ? 'bg-primary-fixed text-primary border-outline-variant' 
                      : 'text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-low'
                  }`}
                >
                  {tName}
                </button>
              ))}
            </div>

            {/* Schema structure display card */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[11px] font-mono">
                <span className="font-bold text-on-surface-variant uppercase text-[10px]">Structure: {activeSchema.table_name}</span>
                <span className="font-bold text-primary">{activeSchema.columns.length} cols</span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {activeSchema.columns.map(col => {
                  const isNumber = col.includes('id') || col.includes('salary') || col.includes('limit');
                  const isDate = col.includes('date');
                  const typeLabel = isNumber ? 'NUMBER' : isDate ? 'DATE' : 'VARCHAR2(100)';

                  return (
                    <div key={col} className="p-2 bg-surface-container-low rounded border border-outline-variant/60 flex justify-between items-center text-[10px] font-mono">
                      <span className="font-bold text-on-surface">{col}</span>
                      <span className="text-[9px] font-bold text-on-surface-variant">{typeLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick tip deck */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant space-y-2.5 font-serif">
            <h4 className="font-bold text-xs text-primary flex items-center gap-1 font-sans uppercase tracking-wider">
              <Sparkles size={14} className="text-primary" />
              <span>Syntax Reminders</span>
            </h4>
            <div className="space-y-2 text-[11px] text-on-surface-variant italic leading-relaxed pl-1">
              <p>• WHERE filters are case-sensitive: <code className="font-mono font-bold bg-surface-container-low px-1 py-0.5 rounded not-italic">first_name = 'Steven'</code> (capital S!).</p>
              <p>• Semicolons are required to segment multiple queries in real-world Oracle shells.</p>
              <p>• Avoid double quotes for string values, always use single quotes: <code className="font-mono font-bold bg-surface-container-low px-1 py-0.5 rounded not-italic">'IT_PROG'</code>.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
