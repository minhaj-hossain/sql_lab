import {
  Lesson,
  Phase,
  Badge,
  TableData,
  Quiz,
  QueryModification,
} from "../types";

export const PHASES: Phase[] = [
  {
    phase_id: "phase_1",
    name: "SQL & Analytic Querying",
    level: "beginner",
    lesson_range: "1-52",
    covers: [
      "SELECT",
      "FROM",
      "WHERE & Comparisons",
      "ORDER BY & DISTINCT",
      "Joins & Subqueries",
      "Analytic Functions (LAG/LEAD/RANK)",
      "Conditional CASE expressions",
      "Group Rollups & Cubes",
    ],
  },
  {
    phase_id: "phase_2",
    name: "PL/SQL Procedural Blocks",
    level: "intermediate",
    lesson_range: "53-106",
    covers: [
      "DECLARE / BEGIN / END",
      "Variables & Anchor Types",
      "Conditional Logic & Loops",
      "Explicit Cursors",
      "Procedures & Functions",
      "Packages & Spec Body design",
      "Triggers & Constraints",
      "Exceptions (ZERO_DIVIDE/NO_DATA_FOUND)",
    ],
  },
  {
    phase_id: "phase_3",
    name: "Advanced Database & Tuning",
    level: "advanced",
    lesson_range: "107-158",
    covers: [
      "Dynamic SQL (EXECUTE IMMEDIATE)",
      "BULK COLLECT & FORALL",
      "LOB Columns (CLOB/BLOB/BFILE)",
      "CPU & Memory Profiling",
      "Autonomous Transactions",
      "Result Cache & VPD Security",
      "Query Tuning (EXPLAIN PLAN)",
      "Flashback Queries",
    ],
  },
];

export const BADGES: Badge[] = [
  {
    id: "first_steps",
    title: "First Steps",
    description: "Completed your first SQL query!",
    icon: "Play",
    xpRequired: 100,
  },
  {
    id: "filter_master",
    title: "Filter Master",
    description: "Learned how to filter rows using comparison operators.",
    icon: "Filter",
    xpRequired: 300,
  },
  {
    id: "sorter_pro",
    title: "Data Organizer",
    description:
      "Sorted rows using ORDER BY in ascending and descending order.",
    icon: "SortAsc",
    xpRequired: 500,
  },
  {
    id: "phase_1_graduate",
    title: "Phase 1 Graduate",
    description: "Successfully mastered all lessons in Phase 1!",
    icon: "GraduationCap",
    xpRequired: 900,
  },
];

const HANDWRITTEN_LESSONS: Lesson[] = [
  {
    id: "lesson_001",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 1,
    title: "Introduction to SELECT Statements",
    difficulty: "easy",
    query_type: "SELECT basics",
    sql: "SELECT * FROM employees;",
    short_description:
      "Show every column and every row from the employees table.",
    real_world_use_case:
      "Amazon's internal HR dashboard uses a query exactly like this to pull up the full employee list before applying any filters, so managers can see everything before narrowing down.",
    goal_of_this_query:
      "To understand that a database stores information in tables (like spreadsheets), and that SQL is the language we use to ask the database to show us that information.",
    before_learning: {
      required_knowledge: [
        "None. This is the very first lesson. You do not need to know anything about computers, spreadsheets, or programming.",
      ],
      new_concepts: [
        "What a database is",
        "What a table is",
        "What SQL is",
        "What a query is",
        "The SELECT keyword",
        "The FROM keyword",
        "The asterisk (*) symbol",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "SELECT",
        meaning:
          "SELECT is how you tell the database 'I want to see some information.' It always comes first in a query that reads data.",
        why_we_use_it:
          "Without SELECT, the database has no idea you want to look at anything. It's like walking into a library and just standing there - you have to say 'I want to read this book' before the librarian helps you.",
        easy_example:
          "SELECT tells the computer: 'Show me something.' The something comes right after the word SELECT.",
        common_mistake:
          "Beginners forget that SELECT alone does nothing - it always needs a FROM to say where the data is coming from.",
      },
      {
        keyword: "*",
        meaning:
          "The asterisk (*) is a shortcut that means 'all columns.' Instead of typing every column name one by one, * says 'give me everything.'",
        why_we_use_it:
          "It's fast and useful when you don't know the column names yet, or when you genuinely want to see the whole table.",
        easy_example:
          "SELECT * is like telling a waiter 'bring me one of everything on the menu' instead of naming each dish.",
        common_mistake:
          "In real jobs, using * too often is considered lazy and slow, because it pulls columns you may not need. Beginners should know it, but professionals usually name exact columns.",
      },
      {
        keyword: "FROM",
        meaning:
          "FROM tells the database exactly which table to look inside. A database can have many tables, so SQL needs to know which one you mean.",
        why_we_use_it:
          "Imagine a filing cabinet with many drawers (tables). FROM tells the database which drawer to open.",
        easy_example:
          "FROM employees means 'open the drawer labeled employees.'",
        common_mistake:
          "Misspelling the table name, or forgetting that table names are usually plural (employees, not employee).",
      },
    ],
    line_by_line_explanation: [
      "SELECT * -> 'Show me all the columns.'",
      "FROM employees -> 'Look inside the table called employees.'",
      "; -> The semicolon tells Oracle 'this is the end of my instruction,' the same way a period ends a sentence.",
    ],
    execution_flow: [
      "Oracle reads the FROM clause first internally (even though you type SELECT first) to figure out which table to open.",
      "It opens the employees table.",
      "Because you wrote *, it decides to keep every single column.",
      "It goes row by row and keeps every row, since there is no filtering instruction at all.",
      "It returns the full table exactly as stored.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
        "job_id",
        "manager_id",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
          job_id: "AD_PRES",
          manager_id: null,
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
          job_id: "AD_VP",
          manager_id: 100,
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
          job_id: "AD_VP",
          manager_id: 100,
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
          job_id: "IT_PROG",
          manager_id: 102,
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 50,
          hire_date: "2007-05-21",
          job_id: "IT_PROG",
          manager_id: 103,
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 20,
          hire_date: "2008-02-23",
          job_id: "IT_PROG",
          manager_id: 103,
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: SQL locates the employees table inside the database.",
      "Step 2: SQL notes that * means 'take every column': employee_id, first_name, last_name, salary, department_id, hire_date.",
      "Step 3: SQL looks at the first row (Steven King) and keeps it, because there is no WHERE condition to check.",
      "Step 4: SQL repeats this for every remaining row - nothing is skipped.",
      "Step 5: SQL sends back all six rows with all six columns, in the same order they are stored.",
    ],
    final_result: {
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    output_table: {
      ascii_table:
        "+-------------+------------+-----------+--------+---------------+------------+\n| employee_id | first_name | last_name | salary | department_id | hire_date  |\n+-------------+------------+-----------+--------+---------------+------------+\n|     100     |   Steven   |    King   | 24000  |       90      | 1987-06-17 |\n|     101     |   Neena    |  Kochhar  | 17000  |       90      | 1989-09-21 |\n|     102     |    Lex     |  De Haan  | 17000  |       90      | 1993-01-13 |\n|     103     |   David    |   Austin  |  4800  |       60      | 2005-06-25 |\n|     104     |   Bruce    |   Ernst   |  6000  |       60      | 2007-05-21 |\n|     105     |   David    |    Lee    |  6800  |       60      | 2008-02-23 |\n+-------------+------------+-----------+--------+---------------+------------+",
    },
    visual_explanation: {
      diagram:
        "employees table (6 rows, 6 columns)\n        |\n        v\n   SELECT *  (keep all columns)\n        |\n        v\n   FROM employees (open this table)\n        |\n        v\n   no WHERE = keep all rows\n        |\n        v\n   Output: full table, unchanged",
    },
    important_rules: [
      "Every SELECT query needs a FROM clause when reading from a table.",
      "SQL keywords like SELECT and FROM are not case-sensitive (select and SELECT work the same), but most people write them in UPPERCASE for readability.",
      "A semicolon (;) is used in Oracle to end a statement.",
    ],
    things_to_remember: [
      "* means 'all columns', not 'all tables.'",
      "This query does not change or delete any data - SELECT only looks, it never modifies.",
      "The order of columns in the output matches the order the table was built with, not alphabetical order.",
    ],
    common_beginner_mistakes: [
      "Forgetting the semicolon at the end (Oracle tools often still run it, but it's best practice to include it).",
      "Typing 'select *' but forgetting 'from', which causes an error.",
      "Thinking SELECT * FROM employee (singular) will work when the real table is named employees (plural) - table names must match exactly.",
    ],
    how_to_modify_this_query: [
      {
        change: "Replace * with specific column names",
        new_sql: "SELECT first_name, salary FROM employees;",
        effect:
          "Instead of all 6 columns, only first_name and salary are shown - much faster and cleaner for real use.",
      },
      {
        change:
          "Add a semicolon-less version to see it still runs in most tools",
        new_sql: "SELECT * FROM employees",
        effect:
          "Most SQL tools will still run it, but Oracle SQL*Plus specifically requires the semicolon to execute.",
      },
    ],
    practice_variations: [
      "SELECT * FROM departments;",
      "SELECT * FROM jobs;",
      "SELECT * FROM locations;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does SELECT * mean?",
          options: [
            "Show all rows only",
            "Show all columns",
            "Delete all data",
            "Count all rows",
          ],
          correct_answer: "Show all columns",
          explanation: "The asterisk is a wildcard meaning 'every column.'",
        },
        {
          question: "What does FROM specify?",
          options: [
            "The column to show",
            "The condition to check",
            "The table to read from",
            "The sort order",
          ],
          correct_answer: "The table to read from",
          explanation: "FROM always names the table SQL should look inside.",
        },
        {
          question: "Which symbol ends an Oracle SQL statement?",
          options: [".", ";", ":", "!"],
          correct_answer: ";",
          explanation:
            "Oracle uses a semicolon to mark the end of a statement.",
        },
        {
          question: "Does SELECT * FROM employees; change any data?",
          options: [
            "Yes, it deletes rows",
            "Yes, it updates salaries",
            "No, it only reads data",
            "It creates a new table",
          ],
          correct_answer: "No, it only reads data",
          explanation: "SELECT is a read-only operation.",
        },
        {
          question:
            "If the table is named employees, will 'SELECT * FROM employee;' work?",
          options: [
            "Yes, always",
            "No, table names must match exactly",
            "Only on Mondays",
            "Only with admin rights",
          ],
          correct_answer: "No, table names must match exactly",
          explanation:
            "SQL requires the exact table name; employee \u2260 employees.",
        },
      ],
      true_false: [
        {
          statement: "SELECT * always returns every column in the table.",
          answer: true,
          explanation: "That is exactly what the wildcard * does.",
        },
        {
          statement: "SQL keywords must always be written in lowercase.",
          answer: false,
          explanation:
            "SQL keywords are not case-sensitive; uppercase is just a convention.",
        },
        {
          statement: "This query will delete rows from the employees table.",
          answer: false,
          explanation: "SELECT never deletes or changes data.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT * FROM employees;",
          correct_output: "All 6 rows shown above, with all 6 columns.",
          explanation: "No WHERE clause means nothing is filtered out.",
        },
        {
          sql: "SELECT * FROM employees WHERE 1=0;",
          correct_output:
            "Zero rows (an empty result), but the column headers still appear.",
          explanation:
            "The condition 1=0 is never true, so every row is excluded, though the structure is still returned.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT * employees;",
          error: "Missing the FROM keyword before the table name.",
          fixed_sql: "SELECT * FROM employees;",
        },
        {
          broken_sql: "SELECT * FROM Employes;",
          error:
            "Table name is misspelled ('Employes' instead of 'employees').",
          fixed_sql: "SELECT * FROM employees;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query that shows every column and every row from a table called departments.",
          expected_answer: "SELECT * FROM departments;",
        },
      ],
    },
    coding_challenge: {
      prompt:
        "Write a query that displays the entire jobs table, with no filtering at all.",
      hints: [
        "Start with SELECT",
        "Use * to mean all columns",
        "Use FROM followed by the table name",
        "Don't forget the semicolon",
      ],
    },
    expected_answer: "SELECT * FROM jobs;",
    related_lessons: ["lesson_002", "lesson_003"],
  },
  {
    id: "lesson_002",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 2,
    title: "Column Selection & Projection",
    difficulty: "easy",
    query_type: "SELECT basics",
    sql: "SELECT first_name, last_name, salary FROM employees;",
    short_description:
      "Show only the first name, last name, and salary columns instead of the whole table.",
    real_world_use_case:
      "A payroll app at a bank only pulls employee name and salary columns when preparing a pay slip - it never needs to pull every column just to print a slip.",
    goal_of_this_query:
      "To learn that you can pick and choose exactly which columns you want to see, instead of getting everything with *.",
    before_learning: {
      required_knowledge: ["Lesson 1: SELECT, FROM, and what a table is"],
      new_concepts: [
        "Selecting specific columns by name",
        "Separating column names with commas",
        "Column order in output matches the order you type them",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "SELECT column_name",
        meaning:
          "Instead of *, you type the exact names of the columns you want.",
        why_we_use_it:
          "It's faster, cleaner, and only shows relevant data - important in real jobs with huge tables.",
        easy_example:
          "Like ordering 'just the fries and a drink' instead of the whole combo meal.",
        common_mistake:
          "Misspelling a column name, which causes an 'invalid identifier' error.",
      },
      {
        keyword: ",",
        meaning: "The comma separates one column name from the next.",
        why_we_use_it:
          "SQL needs a clear way to know where one column name ends and another begins.",
        easy_example:
          "first_name, last_name, salary - three items in a shopping list, separated by commas.",
        common_mistake:
          "Forgetting a comma between column names, or leaving a trailing comma after the last column.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name, last_name, salary -> 'Show me only these three columns, in this order.'",
      "FROM employees -> 'Look inside the employees table.'",
    ],
    execution_flow: [
      "Oracle opens the employees table.",
      "It looks at the column list you asked for: first_name, last_name, salary.",
      "It ignores employee_id, department_id, and hire_date completely - they are never even shown.",
      "Since there's no WHERE clause, every row is kept.",
      "It returns just those 3 columns, for all 6 rows.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: SQL opens employees.",
      "Step 2: SQL notes it only needs first_name, last_name, and salary - the other 3 columns are set aside.",
      "Step 3: SQL goes row by row, keeping all rows since there's no filter.",
      "Step 4: For each row, only the 3 chosen columns are placed into the output.",
      "Step 5: The final output has 6 rows and exactly 3 columns.",
    ],
    final_result: {
      columns: ["first_name", "last_name", "salary"],
      rows: [
        {
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
        },
        {
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
        },
        {
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
        },
        {
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
        },
        {
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
        },
        {
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+-----------+--------+\n| first_name | last_name | salary |\n+------------+-----------+--------+\n|   Steven   |    King   | 24000  |\n|   Neena    |  Kochhar  | 17000  |\n|    Lex     |  De Haan  | 17000  |\n|   David    |   Austin  |  4800  |\n|   Bruce    |   Ernst   |  6000  |\n|   David    |    Lee    |  6800  |\n+------------+-----------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees table (6 columns)\n   |\n   v\nSELECT first_name, last_name, salary  (keep only these 3)\n   |\n   v\nFROM employees\n   |\n   v\nOutput: 6 rows, 3 columns only",
    },
    important_rules: [
      "Column names must be spelled and typed exactly as they exist in the table.",
      "The order you list columns is the order they appear in the output.",
      "Commas go between column names, never after the last one.",
    ],
    things_to_remember: [
      "Selecting only what you need is considered better practice than SELECT * in real jobs.",
      "This does not change the table - it only changes what you SEE.",
    ],
    common_beginner_mistakes: [
      "Adding a comma after the last column name, e.g. 'salary,' which causes an error.",
      "Mixing up column order and expecting the table's original order instead of your typed order.",
      "Typing a column name that doesn't exist, e.g. 'name' instead of 'first_name'.",
    ],
    how_to_modify_this_query: [
      {
        change: "Reorder the columns",
        new_sql: "SELECT salary, first_name, last_name FROM employees;",
        effect:
          "The output now shows salary first - order fully depends on how you type it.",
      },
      {
        change: "Add another column, department_id",
        new_sql:
          "SELECT first_name, last_name, salary, department_id FROM employees;",
        effect: "One more column of data appears in the output.",
      },
    ],
    practice_variations: [
      "SELECT department_id, salary FROM employees;",
      "SELECT first_name, hire_date FROM employees;",
      "SELECT employee_id FROM employees;",
    ],
    quiz: {
      mcq: [
        {
          question: "What happens if you list column names instead of *?",
          options: [
            "An error occurs",
            "Only those columns are shown",
            "The table is deleted",
            "All columns still show",
          ],
          correct_answer: "Only those columns are shown",
          explanation:
            "Naming columns limits the output to exactly those columns.",
        },
        {
          question: "What separates multiple column names in a SELECT list?",
          options: ["A semicolon", "A comma", "A colon", "A space only"],
          correct_answer: "A comma",
          explanation: "Commas separate each column name.",
        },
        {
          question: "Does column order in SELECT affect output order?",
          options: ["Yes", "No", "Only in Oracle", "Only with ORDER BY"],
          correct_answer: "Yes",
          explanation:
            "Columns appear in the output in the exact order you list them.",
        },
        {
          question: "What error occurs if you misspell a column name?",
          options: [
            "Table not found",
            "Invalid identifier",
            "Syntax highlighted in blue",
            "Nothing, it's ignored",
          ],
          correct_answer: "Invalid identifier",
          explanation:
            "Oracle throws an 'invalid identifier' error for unknown column names.",
        },
        {
          question:
            "Is 'SELECT first_name, last_name, FROM employees;' (with a trailing comma) valid?",
          options: [
            "Yes",
            "No",
            "Only in newer Oracle versions",
            "Only with *",
          ],
          correct_answer: "No",
          explanation: "A trailing comma before FROM is a syntax error.",
        },
      ],
      true_false: [
        {
          statement: "You can select only some columns from a table.",
          answer: true,
          explanation: "That's exactly what this lesson demonstrates.",
        },
        {
          statement:
            "Selecting fewer columns changes the actual table structure.",
          answer: false,
          explanation: "SELECT never changes the underlying table.",
        },
        {
          statement: "Column order in the SELECT list is ignored by Oracle.",
          answer: false,
          explanation:
            "The order you write columns is the order they're displayed.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT last_name, first_name FROM employees;",
          correct_output:
            "Two columns: last_name first, then first_name, for all 6 rows.",
          explanation: "Columns display in the order typed.",
        },
        {
          sql: "SELECT salary FROM employees;",
          correct_output:
            "A single column of 6 salary values: 24000, 17000, 17000, 4800, 6000, 6800.",
          explanation: "Only the requested column is returned.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT first_name last_name FROM employees;",
          error: "Missing comma between first_name and last_name.",
          fixed_sql: "SELECT first_name, last_name FROM employees;",
        },
        {
          broken_sql: "SELECT first_name, salry FROM employees;",
          error: "'salry' is misspelled - should be 'salary'.",
          fixed_sql: "SELECT first_name, salary FROM employees;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query that shows only employee_id and hire_date from employees.",
          expected_answer: "SELECT employee_id, hire_date FROM employees;",
        },
      ],
    },
    coding_challenge: {
      prompt: "Show only first_name and department_id for all employees.",
      hints: [
        "List exactly 2 column names",
        "Separate them with a comma",
        "End with FROM employees;",
      ],
    },
    expected_answer: "SELECT first_name, department_id FROM employees;",
    related_lessons: ["lesson_001", "lesson_003"],
  },
  {
    id: "lesson_003",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 3,
    title: "Row Filtering with WHERE Clauses",
    difficulty: "easy",
    query_type: "WHERE filtering",
    sql: "SELECT first_name, salary FROM employees WHERE salary > 10000;",
    short_description:
      "Show only the employees whose salary is greater than 10000.",
    real_world_use_case:
      "Netflix's internal finance tools use WHERE conditions like this to instantly find all employees earning above a certain salary band for budget reports.",
    goal_of_this_query:
      "To understand that WHERE lets you filter rows - keeping only the rows that match a condition, and throwing away the rest.",
    before_learning: {
      required_knowledge: [
        "Lesson 1: SELECT/FROM",
        "Lesson 2: choosing specific columns",
      ],
      new_concepts: [
        "The WHERE clause",
        "The greater-than (>) comparison operator",
        "The idea of 'filtering' rows",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "WHERE",
        meaning:
          "WHERE lets you set a condition. Only rows where the condition is TRUE get kept in the result.",
        why_we_use_it:
          "Without WHERE, you always get every row - which is often too much information. WHERE narrows it down.",
        easy_example:
          "Like telling a librarian 'only show me books published after 2020' instead of every book in the library.",
        common_mistake:
          "Beginners sometimes put WHERE before FROM, but the correct order is always SELECT ... FROM ... WHERE ...",
      },
      {
        keyword: ">",
        meaning:
          "The greater-than symbol checks if a value is bigger than another value.",
        why_we_use_it:
          "It lets us compare numbers, like salary, to a target number.",
        easy_example:
          "salary > 10000 means 'the salary must be more than 10000 to be kept.'",
        common_mistake:
          "Confusing > (greater than) with >= (greater than or equal to) - notice 10000 itself would NOT be included with just >.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name, salary -> 'I only want to see these two columns.'",
      "FROM employees -> 'Look inside the employees table.'",
      "WHERE salary > 10000 -> 'But only keep rows where the salary column is bigger than 10000.'",
    ],
    execution_flow: [
      "Oracle opens the employees table.",
      "For each row, it checks the WHERE condition: is salary > 10000?",
      "If TRUE, the row is kept for now. If FALSE, the row is thrown away completely.",
      "After filtering, only the surviving rows move on to the SELECT step.",
      "Finally, only first_name and salary are shown for the surviving rows.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: SQL opens employees.",
      "Step 2: Row 1 (Steven, 24000) -> 24000 > 10000? Yes -> keep.",
      "Step 3: Row 2 (Neena, 17000) -> 17000 > 10000? Yes -> keep.",
      "Step 4: Row 3 (Lex, 17000) -> 17000 > 10000? Yes -> keep.",
      "Step 5: Row 4 (David Austin, 4800) -> 4800 > 10000? No -> discard.",
      "Step 6: Row 5 (Bruce, 6000) -> No -> discard. Row 6 (David Lee, 6800) -> No -> discard.",
      "Step 7: Only the 3 surviving rows show first_name and salary.",
    ],
    final_result: {
      columns: ["first_name", "salary"],
      rows: [
        {
          first_name: "Steven",
          salary: 24000,
        },
        {
          first_name: "Neena",
          salary: 17000,
        },
        {
          first_name: "Lex",
          salary: 17000,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+--------+\n| first_name | salary |\n+------------+--------+\n|   Steven   | 24000  |\n|   Neena    | 17000  |\n|    Lex     | 17000  |\n+------------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees table (6 rows)\n   |\n   v\nWHERE salary > 10000\n   |\n   v\nKeep: Steven, Neena, Lex\nRemove: David Austin, Bruce, David Lee\n   |\n   v\nSELECT first_name, salary\n   |\n   v\nOutput: 3 rows",
    },
    important_rules: [
      "WHERE always comes after FROM, never before it.",
      "WHERE is checked row by row, before SELECT decides which columns to show.",
      "Comparison operators include: > (greater than), < (less than), = (equal), >= , <=, <> (not equal).",
    ],
    things_to_remember: [
      "WHERE filters ROWS, not columns - it decides which rows survive.",
      "Rows that don't match the condition are not deleted from the table - they're just not shown in this particular result.",
    ],
    common_beginner_mistakes: [
      "Using = instead of > when they actually want 'greater than'.",
      "Forgetting that text values need quotes but numbers do not, e.g. salary > 10000 (no quotes) vs first_name = 'Steven' (quotes needed).",
      "Writing WHERE before FROM, e.g. SELECT ... WHERE ... FROM ..., which is a syntax error.",
    ],
    how_to_modify_this_query: [
      {
        change: "Include salaries equal to 10000 as well",
        new_sql:
          "SELECT first_name, salary FROM employees WHERE salary >= 10000;",
        effect:
          "Now any employee earning exactly 10000 would also be included (none in this data, but the logic changes).",
      },
      {
        change: "Flip the condition to find lower earners",
        new_sql:
          "SELECT first_name, salary FROM employees WHERE salary < 10000;",
        effect:
          "This now returns David Austin, Bruce, and David Lee instead - the opposite group.",
      },
    ],
    practice_variations: [
      "SELECT first_name, salary FROM employees WHERE salary > 5000;",
      "SELECT first_name FROM employees WHERE department_id = 90;",
      "SELECT first_name, salary FROM employees WHERE salary <> 17000;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does WHERE do?",
          options: [
            "Sorts the rows",
            "Filters which rows are kept",
            "Deletes columns",
            "Renames columns",
          ],
          correct_answer: "Filters which rows are kept",
          explanation:
            "WHERE checks a condition per row and keeps only matching rows.",
        },
        {
          question: "In 'WHERE salary > 10000', what does > mean?",
          options: ["Equal to", "Greater than", "Less than", "Not equal to"],
          correct_answer: "Greater than",
          explanation:
            "> checks if the left value is bigger than the right value.",
        },
        {
          question:
            "Is an employee earning exactly 10000 included in 'salary > 10000'?",
          options: ["Yes", "No", "Only if rounded", "Depends on the table"],
          correct_answer: "No",
          explanation:
            "> excludes the exact boundary value; >= would include it.",
        },
        {
          question: "Which comes first in a valid SELECT statement?",
          options: [
            "WHERE then FROM",
            "FROM then WHERE",
            "They can be in any order",
            "WHERE must come first always",
          ],
          correct_answer: "FROM then WHERE",
          explanation: "Correct SQL order is SELECT, FROM, WHERE.",
        },
        {
          question:
            "Does WHERE permanently delete non-matching rows from the table?",
          options: [
            "Yes",
            "No, it only hides them from this result",
            "Yes, but only in Oracle",
            "Only if COMMIT is used",
          ],
          correct_answer: "No, it only hides them from this result",
          explanation: "SELECT with WHERE never modifies the stored table.",
        },
      ],
      true_false: [
        {
          statement:
            "WHERE salary > 10000 will include an employee with salary exactly 10000.",
          answer: false,
          explanation: "> strictly excludes the boundary value.",
        },
        {
          statement: "WHERE is used to filter rows based on a condition.",
          answer: true,
          explanation: "Correct - that's its entire purpose.",
        },
        {
          statement: "You can use WHERE without a FROM clause.",
          answer: false,
          explanation: "WHERE needs FROM to know which table's rows to check.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT first_name, salary FROM employees WHERE salary >= 17000;",
          correct_output:
            "Steven (24000), Neena (17000), Lex (17000) - three rows.",
          explanation: ">= includes values equal to 17000 as well as above it.",
        },
        {
          sql: "SELECT first_name FROM employees WHERE department_id = 60;",
          correct_output:
            "David Austin, Bruce, David Lee - three rows, one column.",
          explanation: "Only rows where department_id equals 60 match.",
        },
      ],
      find_error: [
        {
          broken_sql:
            "SELECT first_name, salary WHERE salary > 10000 FROM employees;",
          error: "WHERE is placed before FROM - wrong clause order.",
          fixed_sql:
            "SELECT first_name, salary FROM employees WHERE salary > 10000;",
        },
        {
          broken_sql:
            "SELECT first_name FROM employees WHERE department_id = '60';",
          error:
            "department_id is a number column; it should not be wrapped in quotes.",
          fixed_sql:
            "SELECT first_name FROM employees WHERE department_id = 60;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing first_name and salary for employees earning less than 7000.",
          expected_answer:
            "SELECT first_name, salary FROM employees WHERE salary < 7000;",
        },
      ],
    },
    coding_challenge: {
      prompt:
        "Show first_name and department_id only for employees in department_id 90.",
      hints: [
        "Use WHERE with =",
        "Numbers don't need quotes",
        "department_id = 90",
      ],
    },
    expected_answer:
      "SELECT first_name, department_id FROM employees WHERE department_id = 90;",
    related_lessons: ["lesson_002", "lesson_004"],
  },
  {
    id: "lesson_004",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 4,
    title: "Using Comparison Operators",
    difficulty: "easy",
    query_type: "WHERE filtering",
    sql: "SELECT first_name, salary FROM employees WHERE salary <> 17000;",
    short_description: "Show employees whose salary is NOT 17000.",
    real_world_use_case:
      "An airline's crew scheduling system uses <> to exclude staff already assigned to a route when building a new roster.",
    goal_of_this_query:
      "To learn all the comparison operators (=, <>, >=, <=) beyond just > and <, so you can filter data in every possible way.",
    before_learning: {
      required_knowledge: ["Lesson 3: WHERE and >"],
      new_concepts: [
        "<> (not equal to)",
        ">= and <= (greater/less than or equal to)",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "<>",
        meaning:
          "Means 'not equal to'. It keeps rows where the value is different from the one you gave.",
        why_we_use_it:
          "Sometimes you want to exclude a specific value instead of matching it.",
        easy_example:
          "salary <> 17000 means 'any salary except exactly 17000'.",
        common_mistake:
          "Some beginners try to use != in Oracle - it also works, but <> is the standard ANSI SQL way.",
      },
      {
        keyword: ">= and <=",
        meaning:
          ">= means 'greater than or equal to', <= means 'less than or equal to'.",
        why_we_use_it:
          "They let boundary values be included, unlike strict > or <.",
        easy_example:
          "salary >= 6000 includes an employee earning exactly 6000.",
        common_mistake:
          "Writing => or =< instead of >= and <= - the equals sign always comes second.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name, salary -> show these two columns",
      "FROM employees -> from this table",
      "WHERE salary <> 17000 -> only keep rows where salary is not exactly 17000",
    ],
    execution_flow: [
      "Open employees table.",
      "Check each row: is salary different from 17000?",
      "Keep rows where true, discard where false (i.e. discard the two 17000 earners).",
      "Show first_name and salary for the survivors.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: Steven 24000 <> 17000? Yes -> keep.",
      "Step 2: Neena 17000 <> 17000? No -> discard.",
      "Step 3: Lex 17000 <> 17000? No -> discard.",
      "Step 4: David Austin 4800, Bruce 6000, David Lee 6800 -> all keep, since none equal 17000.",
    ],
    final_result: {
      columns: ["first_name", "salary"],
      rows: [
        {
          first_name: "Steven",
          salary: 24000,
        },
        {
          first_name: "David",
          salary: 4800,
        },
        {
          first_name: "Bruce",
          salary: 6000,
        },
        {
          first_name: "David",
          salary: 6800,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+--------+\n| first_name | salary |\n+------------+--------+\n|   Steven   | 24000  |\n|   David    |  4800  |\n|   Bruce    |  6000  |\n|   David    |  6800  |\n+------------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees\n  |\n  v\nWHERE salary <> 17000\n  |\n  v\nRemove: Neena, Lex (both 17000)\nKeep: Steven, David A., Bruce, David L.\n  |\n  v\nOutput: 4 rows",
    },
    important_rules: [
      "<> and != both mean not-equal in Oracle, but <> is the standard.",
      "Comparison operators work the same on numbers as they do conceptually on dates.",
    ],
    things_to_remember: [
      ">= and <= include the boundary value; > and < do not.",
      "<> excludes only the exact value given, everything else passes.",
    ],
    common_beginner_mistakes: [
      "Writing =< or => instead of <= and >=.",
      "Confusing <> (not equal) with < (less than).",
    ],
    how_to_modify_this_query: [
      {
        change: "Use != instead of <>",
        new_sql:
          "SELECT first_name, salary FROM employees WHERE salary != 17000;",
        effect:
          "Identical result - != is just an alternate symbol for not-equal in Oracle.",
      },
      {
        change: "Combine with >=",
        new_sql:
          "SELECT first_name, salary FROM employees WHERE salary >= 6000;",
        effect: "Now only employees earning 6000 or more appear.",
      },
    ],
    practice_variations: [
      "SELECT first_name FROM employees WHERE department_id <> 60;",
      "SELECT first_name, salary FROM employees WHERE salary <= 6800;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does <> mean?",
          options: ["Equal to", "Not equal to", "Greater than", "Less than"],
          correct_answer: "Not equal to",
          explanation: "<> excludes an exact value.",
        },
        {
          question:
            "Does salary >= 6000 include an employee earning exactly 6000?",
          options: ["Yes", "No"],
          correct_answer: "Yes",
          explanation: ">= includes the boundary.",
        },
        {
          question: "Which symbol is Oracle's alternate for <>?",
          options: ["=!", "!=", "<=", ">="],
          correct_answer: "!=",
          explanation: "Oracle accepts != as well as <>.",
        },
        {
          question: "salary <= 4800 - which employee(s) match?",
          options: ["Steven", "David Austin", "Bruce", "Neena"],
          correct_answer: "David Austin",
          explanation: "David Austin earns exactly 4800.",
        },
        {
          question: "Is 'salary =< 5000' valid syntax?",
          options: ["Yes", "No"],
          correct_answer: "No",
          explanation: "The equals sign must come after: <= not =<.",
        },
      ],
      true_false: [
        {
          statement: "<> and != do the same thing in Oracle.",
          answer: true,
          explanation: "Both mean not-equal.",
        },
        {
          statement: ">= excludes the exact boundary value.",
          answer: false,
          explanation: ">= includes the boundary; only > excludes it.",
        },
        {
          statement:
            "WHERE salary <> 17000 removes rows where salary is exactly 17000.",
          answer: true,
          explanation: "Correct, that's the definition of not-equal.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT first_name FROM employees WHERE salary <= 6000;",
          correct_output: "David Austin, Bruce (4800 and 6000, both <= 6000).",
          explanation: "<= includes 6000 itself.",
        },
        {
          sql: "SELECT first_name FROM employees WHERE department_id <> 90;",
          correct_output:
            "David Austin, Bruce, David Lee (the three in department 60).",
          explanation: "<> 90 excludes the department_id 90 rows.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT first_name FROM employees WHERE salary => 6000;",
          error: "'=>' is invalid; the correct operator is >=.",
          fixed_sql: "SELECT first_name FROM employees WHERE salary >= 6000;",
        },
        {
          broken_sql: "SELECT first_name FROM employees WHERE salary <> ;",
          error: "Missing the value to compare against.",
          fixed_sql: "SELECT first_name FROM employees WHERE salary <> 17000;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing first_name for employees NOT in department_id 60.",
          expected_answer:
            "SELECT first_name FROM employees WHERE department_id <> 60;",
        },
      ],
    },
    coding_challenge: {
      prompt: "Show first_name and salary for employees earning at least 6800.",
      hints: ["Use >=", "6800 is the boundary and should be included"],
    },
    expected_answer:
      "SELECT first_name, salary FROM employees WHERE salary >= 6800;",
    related_lessons: ["lesson_003", "lesson_005"],
  },
  {
    id: "lesson_005",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 5,
    title: "Sorting Results with ORDER BY",
    difficulty: "easy",
    query_type: "ORDER BY sorting",
    sql: "SELECT first_name, salary FROM employees ORDER BY salary;",
    short_description:
      "Show first_name and salary, sorted from the smallest salary to the largest.",
    real_world_use_case:
      "Spotify's internal reporting tools sort artist royalty payouts from lowest to highest to spot unusually low payments needing review.",
    goal_of_this_query:
      "To learn how to sort query results using ORDER BY, and that the default sort direction is smallest-to-largest (ascending).",
    before_learning: {
      required_knowledge: [
        "Lessons 1-4: SELECT, FROM, WHERE, comparison operators",
      ],
      new_concepts: ["ORDER BY clause", "Ascending order (default)"],
    },
    keyword_breakdown: [
      {
        keyword: "ORDER BY",
        meaning:
          "ORDER BY arranges your result rows in a specific order based on one or more columns.",
        why_we_use_it:
          "Without it, rows come back in whatever order the database feels like (often insertion order, but not guaranteed) - ORDER BY guarantees a specific order.",
        easy_example:
          "Like arranging your playing cards from lowest number to highest.",
        common_mistake:
          "Forgetting that ORDER BY always goes at the very end of the query, after WHERE if WHERE is present.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name, salary -> show these columns",
      "FROM employees -> from this table",
      "ORDER BY salary -> sort the final result by the salary column, smallest first",
    ],
    execution_flow: [
      "Open employees table.",
      "No WHERE clause, so keep all rows.",
      "Pick first_name and salary for each row.",
      "Before returning, sort all these rows by salary, smallest number first.",
      "Return the sorted list.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: Gather all 6 rows with first_name and salary.",
      "Step 2: Compare every salary value.",
      "Step 3: Arrange from lowest (4800) to highest (24000).",
      "Step 4: Return the newly ordered list - the actual table itself is untouched.",
    ],
    final_result: {
      columns: ["first_name", "salary"],
      rows: [
        {
          first_name: "David",
          salary: 4800,
        },
        {
          first_name: "Bruce",
          salary: 6000,
        },
        {
          first_name: "David",
          salary: 6800,
        },
        {
          first_name: "Neena",
          salary: 17000,
        },
        {
          first_name: "Lex",
          salary: 17000,
        },
        {
          first_name: "Steven",
          salary: 24000,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+--------+\n| first_name | salary |\n+------------+--------+\n|   David    |  4800  |\n|   Bruce    |  6000  |\n|   David    |  6800  |\n|   Neena    | 17000  |\n|    Lex     | 17000  |\n|   Steven   | 24000  |\n+------------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees (unsorted)\n  |\n  v\nORDER BY salary (ascending)\n  |\n  v\n4800 -> 6000 -> 6800 -> 17000 -> 17000 -> 24000\n  |\n  v\nOutput: sorted from smallest to largest salary",
    },
    important_rules: [
      "ORDER BY always comes last in the SELECT statement.",
      "By default, ORDER BY sorts smallest-to-largest for numbers and A-to-Z for text.",
      "ORDER BY does not permanently change how data is stored - it only changes how this one result looks.",
    ],
    things_to_remember: [
      "You can ORDER BY a column that isn't even in the SELECT list.",
      "Sorting happens after filtering - if there were a WHERE clause, it filters first, THEN sorts.",
    ],
    common_beginner_mistakes: [
      "Putting ORDER BY before WHERE (wrong clause order).",
      "Assuming rows come back sorted by default - they don't, unless you explicitly say ORDER BY.",
      "Forgetting ORDER BY sorts ascending by default without needing to write ASC.",
    ],
    how_to_modify_this_query: [
      {
        change: "Sort by first_name instead",
        new_sql:
          "SELECT first_name, salary FROM employees ORDER BY first_name;",
        effect:
          "Now rows are sorted alphabetically by name instead of by salary number.",
      },
      {
        change: "Add WHERE before ORDER BY",
        new_sql:
          "SELECT first_name, salary FROM employees WHERE department_id = 60 ORDER BY salary;",
        effect:
          "First filters to only department 60, then sorts just those 3 rows by salary.",
      },
    ],
    practice_variations: [
      "SELECT first_name, hire_date FROM employees ORDER BY hire_date;",
      "SELECT first_name FROM employees ORDER BY first_name;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does ORDER BY do?",
          options: [
            "Filters rows",
            "Sorts the result",
            "Deletes duplicate rows",
            "Renames a column",
          ],
          correct_answer: "Sorts the result",
          explanation: "ORDER BY arranges the output rows in a chosen order.",
        },
        {
          question: "What is the default sort direction for numbers?",
          options: [
            "Largest to smallest",
            "Smallest to largest",
            "Random",
            "Alphabetical",
          ],
          correct_answer: "Smallest to largest",
          explanation: "Ascending is the default, meaning smallest first.",
        },
        {
          question: "Where does ORDER BY go in a query?",
          options: [
            "First",
            "Right after SELECT",
            "At the very end",
            "Before FROM",
          ],
          correct_answer: "At the very end",
          explanation: "Correct order: SELECT, FROM, WHERE, ORDER BY.",
        },
        {
          question: "Can you ORDER BY a column not listed in SELECT?",
          options: ["Yes", "No"],
          correct_answer: "Yes",
          explanation:
            "You can sort by any column from the table, even if it's not shown in the output.",
        },
        {
          question: "Does ORDER BY change the stored table data?",
          options: ["Yes", "No"],
          correct_answer: "No",
          explanation:
            "It only affects how this particular result is displayed.",
        },
      ],
      true_false: [
        {
          statement: "ORDER BY salary sorts from highest to lowest by default.",
          answer: false,
          explanation: "Default is ascending (lowest to highest).",
        },
        {
          statement: "ORDER BY must be the last clause in the query.",
          answer: true,
          explanation: "Correct - it always comes after WHERE if WHERE exists.",
        },
        {
          statement: "ORDER BY permanently reorders rows in the table.",
          answer: false,
          explanation:
            "It only affects the displayed result, not the stored table.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT first_name FROM employees ORDER BY first_name;",
          correct_output:
            "Bruce, David Austin, David Lee, Lex, Neena, Steven (alphabetical order).",
          explanation: "Text columns sort A-to-Z by default.",
        },
        {
          sql: "SELECT salary FROM employees ORDER BY salary;",
          correct_output: "4800, 6000, 6800, 17000, 17000, 24000.",
          explanation: "Numbers sort smallest to largest by default.",
        },
      ],
      find_error: [
        {
          broken_sql:
            "SELECT first_name FROM employees ORDER BY salary WHERE salary > 5000;",
          error: "ORDER BY is placed before WHERE - wrong order.",
          fixed_sql:
            "SELECT first_name FROM employees WHERE salary > 5000 ORDER BY salary;",
        },
        {
          broken_sql: "ORDER BY salary SELECT first_name FROM employees;",
          error: "ORDER BY cannot come before SELECT.",
          fixed_sql: "SELECT first_name FROM employees ORDER BY salary;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing first_name and hire_date sorted by hire_date, earliest first.",
          expected_answer:
            "SELECT first_name, hire_date FROM employees ORDER BY hire_date;",
        },
      ],
    },
    coding_challenge: {
      prompt:
        "Show first_name and salary sorted from lowest to highest salary.",
      hints: [
        "ORDER BY goes at the end",
        "No need to write ASC, it's the default",
      ],
    },
    expected_answer:
      "SELECT first_name, salary FROM employees ORDER BY salary;",
    related_lessons: ["lesson_004", "lesson_006"],
  },
  {
    id: "lesson_006",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 6,
    title: "Reverse and Multi-Column Sorting",
    difficulty: "medium",
    query_type: "ORDER BY sorting",
    sql: "SELECT first_name, last_name, hire_date FROM employees ORDER BY hire_date DESC;",
    short_description:
      "Group rows by department_id, and within each department show highest salary first.",
    real_world_use_case:
      "Uber's internal reports group drivers by city and rank them by earnings within each city, highest earner first - exactly this pattern.",
    goal_of_this_query:
      "To learn DESC for descending order, and how to sort by more than one column, where the second column only matters when the first column has ties.",
    before_learning: {
      required_knowledge: ["Lesson 5: basic ORDER BY"],
      new_concepts: [
        "DESC keyword",
        "Multi-column sorting",
        "How tie-breaking works",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "DESC",
        meaning:
          "DESC reverses the default order, sorting largest-to-smallest (or Z-to-A for text) instead of the default ascending order.",
        why_we_use_it:
          "Sometimes you want the biggest values first, like top earners or newest dates.",
        easy_example: "ORDER BY salary DESC means highest salary shown first.",
        common_mistake:
          "Forgetting DESC only applies to the column right before it - in a multi-column ORDER BY, each column needs its own DESC if you want that column reversed.",
      },
      {
        keyword: "multi-column ORDER BY",
        meaning:
          "You can list more than one column after ORDER BY, separated by commas. SQL sorts by the first column first; only when two rows tie on that column does it look at the second column.",
        why_we_use_it:
          "It lets you create grouped, organized reports - like 'sort by department, then within each department sort by salary'.",
        easy_example:
          "Sort students by grade level first, then by last name within each grade level.",
        common_mistake:
          "Expecting the second column to control the overall order - it only breaks ties within the first column.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name, department_id, salary -> show these 3 columns",
      "FROM employees -> from this table",
      "ORDER BY department_id, salary DESC -> sort by department_id first (ascending, the default), then within each department sort by salary from highest to lowest",
    ],
    execution_flow: [
      "Open employees table, keep all rows (no WHERE).",
      "Group conceptually by department_id, smallest department_id number first (60 before 90).",
      "Inside department_id 60, sort those 3 rows by salary, highest first.",
      "Inside department_id 90, sort those 3 rows by salary, highest first.",
      "Return the combined, fully sorted list.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: Identify department_id groups: 60 and 90.",
      "Step 2: department_id 60 comes before 90 (ascending, default).",
      "Step 3: Within department 60: Bruce (6000), David Lee (6800), David Austin (4800) -> sorted DESC by salary: David Lee (6800), Bruce (6000), David Austin (4800).",
      "Step 4: Within department 90: Steven (24000), Neena (17000), Lex (17000) -> sorted DESC: Steven (24000), then Neena and Lex tied at 17000 (order between exact ties is not guaranteed unless you add a third sort column).",
      "Step 5: Combine: department 60 rows first, then department 90 rows.",
    ],
    final_result: {
      columns: ["first_name", "department_id", "salary"],
      rows: [
        {
          first_name: "David",
          department_id: 60,
          salary: 6800,
        },
        {
          first_name: "Bruce",
          department_id: 60,
          salary: 6000,
        },
        {
          first_name: "David",
          department_id: 60,
          salary: 4800,
        },
        {
          first_name: "Steven",
          department_id: 90,
          salary: 24000,
        },
        {
          first_name: "Neena",
          department_id: 90,
          salary: 17000,
        },
        {
          first_name: "Lex",
          department_id: 90,
          salary: 17000,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+---------------+--------+\n| first_name | department_id | salary |\n+------------+---------------+--------+\n|   David    |       60      |  6800  |\n|   Bruce    |       60      |  6000  |\n|   David    |       60      |  4800  |\n|   Steven   |       90      | 24000  |\n|   Neena    |       90      | 17000  |\n|    Lex     |       90      | 17000  |\n+------------+---------------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees\n  |\n  v\nORDER BY department_id (ascending)\n  |\n  v\nGroup 60 --------- Group 90\n  |                    |\n  v                    v\nsalary DESC        salary DESC\n  |                    |\n  v                    v\nDavid Lee(6800)     Steven(24000)\nBruce(6000)         Neena/Lex(17000)\nDavid Austin(4800)",
    },
    important_rules: [
      "DESC only reverses the column it's written directly after.",
      "ASC is the default and rarely needs to be typed, but can be added for clarity: ORDER BY salary ASC.",
      "Multiple sort columns are separated by commas, just like in SELECT.",
    ],
    things_to_remember: [
      "The first column in ORDER BY is the primary sort; later columns only matter for tie-breaking.",
      "Combining ASC (default) on one column and DESC on another in the same ORDER BY is completely valid.",
    ],
    common_beginner_mistakes: [
      "Writing 'ORDER BY department_id, salary DESC' but expecting DESC to apply to department_id too - it only applies to salary here.",
      "Forgetting a comma between the two sort columns.",
      "Assuming ties (two employees with identical salary) will always come back in a predictable order without adding a tie-breaking column.",
    ],
    how_to_modify_this_query: [
      {
        change: "Make department_id descending too",
        new_sql:
          "SELECT first_name, department_id, salary FROM employees ORDER BY department_id DESC, salary DESC;",
        effect:
          "Now department 90 appears before department 60, and within each, salary is still highest-first.",
      },
      {
        change: "Add a tie-breaker for equal salaries",
        new_sql:
          "SELECT first_name, department_id, salary FROM employees ORDER BY department_id, salary DESC, first_name;",
        effect:
          "When Neena and Lex tie at 17000, they now sort alphabetically by first_name as a tie-breaker.",
      },
    ],
    practice_variations: [
      "SELECT first_name, salary FROM employees ORDER BY salary DESC;",
      "SELECT first_name, department_id FROM employees ORDER BY department_id DESC;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does DESC do?",
          options: [
            "Sorts ascending",
            "Sorts descending",
            "Deletes rows",
            "Groups rows",
          ],
          correct_answer: "Sorts descending",
          explanation: "DESC reverses the default ascending order.",
        },
        {
          question:
            "In 'ORDER BY department_id, salary DESC', which column controls the primary sort?",
          options: ["salary", "department_id", "Both equally", "Neither"],
          correct_answer: "department_id",
          explanation:
            "The first listed column is always the primary sort key.",
        },
        {
          question: "When does the second ORDER BY column matter?",
          options: [
            "Always",
            "Never",
            "Only when the first column has tied values",
            "Only for text columns",
          ],
          correct_answer: "Only when the first column has tied values",
          explanation: "Later columns break ties from earlier columns.",
        },
        {
          question: "Is ASC required to sort ascending?",
          options: [
            "Yes, always",
            "No, it's the default",
            "Only for text",
            "Only for numbers",
          ],
          correct_answer: "No, it's the default",
          explanation: "Ascending is automatic unless DESC is specified.",
        },
        {
          question:
            "Does DESC on the second column affect the first column's order?",
          options: ["Yes", "No"],
          correct_answer: "No",
          explanation: "DESC only affects the column it directly follows.",
        },
      ],
      true_false: [
        {
          statement:
            "ORDER BY department_id, salary DESC sorts salary DESC within each department group.",
          answer: true,
          explanation:
            "Correct - department_id is primary (ascending), salary DESC breaks ties within it.",
        },
        {
          statement: "You can only sort by one column at a time.",
          answer: false,
          explanation: "You can list multiple columns separated by commas.",
        },
        {
          statement: "ASC must always be explicitly written to sort ascending.",
          answer: false,
          explanation: "Ascending is the default; ASC is optional.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT first_name, salary FROM employees ORDER BY salary DESC;",
          correct_output:
            "Steven(24000), then Neena/Lex(17000 tied), David Lee(6800), Bruce(6000), David Austin(4800).",
          explanation: "Highest salary first, descending order.",
        },
        {
          sql: "SELECT first_name, department_id FROM employees ORDER BY department_id DESC;",
          correct_output:
            "All department 90 employees first (Steven, Neena, Lex in some order), then all department 60 employees.",
          explanation: "department_id DESC puts 90 before 60.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT first_name FROM employees ORDER BY DESC salary;",
          error: "DESC must come AFTER the column name, not before.",
          fixed_sql: "SELECT first_name FROM employees ORDER BY salary DESC;",
        },
        {
          broken_sql:
            "SELECT first_name, department_id FROM employees ORDER BY department_id salary DESC;",
          error: "Missing comma between department_id and salary.",
          fixed_sql:
            "SELECT first_name, department_id FROM employees ORDER BY department_id, salary DESC;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing first_name and salary sorted highest salary first.",
          expected_answer:
            "SELECT first_name, salary FROM employees ORDER BY salary DESC;",
        },
      ],
    },
    coding_challenge: {
      prompt:
        "Show first_name, department_id, and salary sorted by department_id descending, then by salary ascending within each department.",
      hints: [
        "ORDER BY department_id DESC, salary",
        "No DESC needed on salary since ascending is default",
      ],
    },
    expected_answer:
      "SELECT first_name, department_id, salary FROM employees ORDER BY department_id DESC, salary;",
    related_lessons: ["lesson_005", "lesson_007"],
  },
  {
    id: "lesson_007",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 7,
    title: "Removing Duplicates with DISTINCT",
    difficulty: "easy",
    query_type: "DISTINCT",
    sql: "SELECT DISTINCT department_id FROM employees;",
    short_description:
      "List each unique department_id only once, even if many employees share it.",
    real_world_use_case:
      "An e-commerce site like Amazon uses DISTINCT to list every unique product category that currently has at least one item, without repeating a category name for each product.",
    goal_of_this_query:
      "To learn that DISTINCT removes duplicate values from your result, showing each unique value only once.",
    before_learning: {
      required_knowledge: ["Lessons 1-6"],
      new_concepts: ["DISTINCT keyword", "The idea of 'unique' values"],
    },
    keyword_breakdown: [
      {
        keyword: "DISTINCT",
        meaning:
          "DISTINCT removes duplicate rows from the result, keeping only unique combinations of the selected column(s).",
        why_we_use_it:
          "Without it, if 3 employees are in department 60, department_id 60 would print 3 times - DISTINCT collapses that into a single line.",
        easy_example:
          "Like asking 'what colors of shirts do we sell?' - you want each color named once, not once per shirt.",
        common_mistake:
          "Forgetting DISTINCT applies to the WHOLE row of selected columns, not just one column, when multiple columns are selected.",
      },
    ],
    line_by_line_explanation: [
      "SELECT DISTINCT department_id -> show department_id, but remove any duplicate values",
      "FROM employees -> from this table",
    ],
    execution_flow: [
      "Open employees table.",
      "Look at the department_id column for every row: 90, 90, 90, 60, 60, 60.",
      "Collapse repeated values, keeping each unique value only once: 90 and 60.",
      "Return the 2 unique values.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: Gather department_id from all 6 rows: 90, 90, 90, 60, 60, 60.",
      "Step 2: Notice 90 appears 3 times and 60 appears 3 times.",
      "Step 3: DISTINCT keeps only one copy of each unique value.",
      "Step 4: Final result: just 60 and 90 (order may vary unless ORDER BY is added).",
    ],
    final_result: {
      columns: ["department_id"],
      rows: [
        {
          department_id: 60,
        },
        {
          department_id: 90,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+---------------+\n| department_id |\n+---------------+\n|       60      |\n|       90      |\n+---------------+",
    },
    visual_explanation: {
      diagram:
        "department_id column: 90, 90, 90, 60, 60, 60\n   |\n   v\nDISTINCT (remove repeats)\n   |\n   v\nOutput: 60, 90 (each shown once)",
    },
    important_rules: [
      "DISTINCT goes right after SELECT, before the column list.",
      "DISTINCT can apply to multiple columns together, treating the whole combination as what must be unique.",
      "Without ORDER BY, the order DISTINCT values appear in is not guaranteed.",
    ],
    things_to_remember: [
      "DISTINCT looks at the combination of ALL selected columns, not each column separately, when more than one column is selected.",
      "DISTINCT does not change the table - only what this particular query displays.",
    ],
    common_beginner_mistakes: [
      "Writing 'SELECT department_id DISTINCT' (wrong order) instead of 'SELECT DISTINCT department_id'.",
      "Expecting SELECT DISTINCT first_name, department_id to only look at duplicates in first_name - it actually checks unique first_name+department_id pairs together.",
      "Forgetting DISTINCT doesn't sort results - add ORDER BY separately if you want a specific order.",
    ],
    how_to_modify_this_query: [
      {
        change: "Add ORDER BY for a predictable order",
        new_sql:
          "SELECT DISTINCT department_id FROM employees ORDER BY department_id;",
        effect:
          "Now the unique department IDs are guaranteed to appear in ascending order: 60, then 90.",
      },
      {
        change: "Use DISTINCT on two columns",
        new_sql: "SELECT DISTINCT department_id, salary FROM employees;",
        effect:
          "Now uniqueness is checked on the department_id+salary pair together - since Neena and Lex share department 90 AND salary 17000, that combination collapses to one row.",
      },
    ],
    practice_variations: [
      "SELECT DISTINCT first_name FROM employees;",
      "SELECT DISTINCT department_id, salary FROM employees;",
    ],
    quiz: {
      mcq: [
        {
          question: "What does DISTINCT do?",
          options: [
            "Sorts rows",
            "Removes duplicate rows/values",
            "Deletes columns",
            "Filters by condition",
          ],
          correct_answer: "Removes duplicate rows/values",
          explanation: "DISTINCT keeps only unique combinations.",
        },
        {
          question: "Where does DISTINCT go in a query?",
          options: [
            "After FROM",
            "Right after SELECT",
            "At the very end",
            "Before SELECT",
          ],
          correct_answer: "Right after SELECT",
          explanation: "Correct syntax is SELECT DISTINCT column_name.",
        },
        {
          question:
            "If department_id has values 90,90,90,60,60,60, how many rows does DISTINCT return?",
          options: ["6", "2", "3", "0"],
          correct_answer: "2",
          explanation: "Only the 2 unique values (60 and 90) remain.",
        },
        {
          question:
            "With two columns, what does DISTINCT check for uniqueness?",
          options: [
            "Only the first column",
            "Only the second column",
            "The combination of both columns together",
            "Neither column",
          ],
          correct_answer: "The combination of both columns together",
          explanation:
            "DISTINCT with multiple columns treats the whole row combination as the unique unit.",
        },
        {
          question: "Does DISTINCT guarantee a sorted order?",
          options: [
            "Yes, always ascending",
            "No, use ORDER BY for guaranteed order",
            "Yes, always descending",
            "Only for text columns",
          ],
          correct_answer: "No, use ORDER BY for guaranteed order",
          explanation:
            "DISTINCT only deduplicates; sorting needs a separate ORDER BY.",
        },
      ],
      true_false: [
        {
          statement: "DISTINCT removes duplicate values from the result.",
          answer: true,
          explanation: "That is its core purpose.",
        },
        {
          statement: "DISTINCT changes the actual stored table data.",
          answer: false,
          explanation: "It only affects the displayed result.",
        },
        {
          statement:
            "SELECT DISTINCT col1, col2 checks col1 and col2 uniqueness separately.",
          answer: false,
          explanation: "It checks the combination of col1+col2 together.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT DISTINCT department_id FROM employees ORDER BY department_id;",
          correct_output: "60, then 90 - exactly two rows, in ascending order.",
          explanation:
            "DISTINCT removes duplicates, ORDER BY guarantees the sequence.",
        },
        {
          sql: "SELECT DISTINCT salary FROM employees;",
          correct_output:
            "24000, 17000, 4800, 6000, 6800 - five unique values (17000 appears twice in the table but only once here).",
          explanation: "The two 17000 salaries collapse into one.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT department_id DISTINCT FROM employees;",
          error:
            "DISTINCT is in the wrong position - it must come right after SELECT.",
          fixed_sql: "SELECT DISTINCT department_id FROM employees;",
        },
        {
          broken_sql: "SELECT DISTINCT(department_id FROM employees;",
          error: "Unmatched parenthesis after DISTINCT.",
          fixed_sql: "SELECT DISTINCT department_id FROM employees;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing each unique salary value in the employees table.",
          expected_answer: "SELECT DISTINCT salary FROM employees;",
        },
      ],
    },
    coding_challenge: {
      prompt: "Show each unique last_name in the employees table.",
      hints: [
        "SELECT DISTINCT comes first",
        "Then the column name",
        "Then FROM employees;",
      ],
    },
    expected_answer: "SELECT DISTINCT last_name FROM employees;",
    related_lessons: ["lesson_006", "lesson_008"],
  },
  {
    id: "lesson_008",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 8,
    title: "Renaming Columns with AS Aliases",
    difficulty: "easy",
    query_type: "Aliases",
    sql: 'SELECT first_name AS "First Name", salary AS "Monthly Salary" FROM employees;',
    short_description:
      "Rename the output column headers to friendlier, human-readable labels.",
    real_world_use_case:
      "Financial reporting tools at companies like JPMorgan use column aliases to turn raw database column names like emp_sal into report-friendly labels like 'Monthly Salary' for executives.",
    goal_of_this_query:
      "To learn that you can temporarily rename a column's header in the output using AS, without changing the real column name in the table.",
    before_learning: {
      required_knowledge: ["Lessons 1-7"],
      new_concepts: [
        "Column aliases",
        "The AS keyword",
        "Double-quoted aliases for spaces/capitalization",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "AS",
        meaning:
          "AS lets you give a column (or table) a temporary alternate name, just for this query's output.",
        why_we_use_it:
          "Real column names are often short and technical (like sal or emp_id) - AS lets you show a friendlier label to humans reading the report.",
        easy_example:
          "salary AS \"Monthly Salary\" shows the header 'Monthly Salary' instead of 'salary'.",
        common_mistake:
          "Forgetting that if an alias has spaces or mixed case, it must be wrapped in double quotes; otherwise Oracle assumes no spaces and uppercases it automatically.",
      },
    ],
    line_by_line_explanation: [
      "SELECT first_name AS \"First Name\" -> show the first_name column, but label its header as 'First Name'",
      "salary AS \"Monthly Salary\" -> show the salary column, labeled 'Monthly Salary'",
      "FROM employees -> from this table",
    ],
    execution_flow: [
      "Open employees table.",
      "Select the first_name and salary columns as usual.",
      "Before displaying, rename the header of first_name to 'First Name' and salary to 'Monthly Salary'.",
      "The underlying data values do not change - only the header labels change.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: SQL fetches first_name and salary values normally.",
      "Step 2: SQL notices the AS clauses and swaps the header text only.",
      "Step 3: Data values (Steven, 24000, etc.) remain exactly the same - just the column titles at the top of the result change.",
    ],
    final_result: {
      columns: ["First Name", "Monthly Salary"],
      rows: [
        {
          "First Name": "Steven",
          "Monthly Salary": 24000,
        },
        {
          "First Name": "Neena",
          "Monthly Salary": 17000,
        },
        {
          "First Name": "Lex",
          "Monthly Salary": 17000,
        },
        {
          "First Name": "David",
          "Monthly Salary": 4800,
        },
        {
          "First Name": "Bruce",
          "Monthly Salary": 6000,
        },
        {
          "First Name": "David",
          "Monthly Salary": 6800,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+------------+----------------+\n| First Name | Monthly Salary |\n+------------+----------------+\n|   Steven   |     24000      |\n|   Neena    |     17000      |\n|    Lex     |     17000      |\n|   David    |      4800      |\n|   Bruce    |      6000      |\n|   David    |      6800      |\n+------------+----------------+",
    },
    visual_explanation: {
      diagram:
        'Raw column: first_name        salary\n                 |               |\n                 v               v\n         AS "First Name"   AS "Monthly Salary"\n                 |               |\n                 v               v\nOutput header: First Name    Monthly Salary',
    },
    important_rules: [
      "AS is technically optional in Oracle - 'salary \"Monthly Salary\"' also works without writing AS.",
      "Aliases with spaces or mixed case must be wrapped in double quotes.",
      "Aliases only exist for the duration of this query - they don't rename anything permanently.",
    ],
    things_to_remember: [
      "Aliases make reports more human-readable, which is extremely common in real business queries.",
      "An alias without quotes and without spaces (like AS emp_name) doesn't need quotes at all.",
    ],
    common_beginner_mistakes: [
      "Using single quotes ('First Name') instead of double quotes (\"First Name\") for aliases - single quotes are for text values, not identifiers.",
      "Forgetting quotes entirely for an alias with a space, which causes a syntax error.",
      "Thinking the alias changes the real table column name - it does not, it's temporary and only for this result.",
    ],
    how_to_modify_this_query: [
      {
        change: "Skip the AS keyword (still valid)",
        new_sql:
          'SELECT first_name "First Name", salary "Monthly Salary" FROM employees;',
        effect:
          "Identical result - AS is optional in Oracle when using quoted aliases.",
      },
      {
        change: "Use a simple alias with no spaces (no quotes needed)",
        new_sql: "SELECT first_name AS fname, salary AS sal FROM employees;",
        effect:
          "Shorter column headers fname and sal appear - no quotes needed since there are no spaces or special characters.",
      },
    ],
    practice_variations: [
      'SELECT department_id AS "Dept" FROM employees;',
      'SELECT hire_date AS "Date Hired" FROM employees;',
    ],
    quiz: {
      mcq: [
        {
          question: "What does the AS keyword do?",
          options: [
            "Filters rows",
            "Renames a column header for this query",
            "Deletes a column",
            "Sorts results",
          ],
          correct_answer: "Renames a column header for this query",
          explanation: "AS creates a temporary alias for display purposes.",
        },
        {
          question: "Does an alias change the real column name in the table?",
          options: [
            "Yes, permanently",
            "No, only for this query's output",
            "Yes, but only for text columns",
            "Only if COMMIT is used",
          ],
          correct_answer: "No, only for this query's output",
          explanation: "Aliases are temporary and cosmetic only.",
        },
        {
          question: "When must an alias be wrapped in double quotes?",
          options: [
            "Always",
            "When it has spaces or mixed case",
            "Only for number columns",
            "Never",
          ],
          correct_answer: "When it has spaces or mixed case",
          explanation: "Quotes preserve spaces and exact casing in the alias.",
        },
        {
          question: "Is the AS keyword required in Oracle?",
          options: [
            "Yes, always",
            "No, it's optional",
            "Only for tables",
            "Only for numbers",
          ],
          correct_answer: "No, it's optional",
          explanation:
            "You can write an alias directly after the column name without AS.",
        },
        {
          question: "Which quote type is correct for an alias with spaces?",
          options: [
            "Single quotes",
            "Double quotes",
            "Backticks",
            "No quotes needed",
          ],
          correct_answer: "Double quotes",
          explanation:
            "Double quotes are used for identifiers/aliases in Oracle; single quotes are for string literals.",
        },
      ],
      true_false: [
        {
          statement: "AS permanently renames a column in the database.",
          answer: false,
          explanation: "It's temporary, just for the query's output.",
        },
        {
          statement: "An alias with a space must be in double quotes.",
          answer: true,
          explanation:
            "Correct - otherwise Oracle can't parse the space correctly.",
        },
        {
          statement: "AS is mandatory when creating an alias in Oracle.",
          answer: false,
          explanation:
            "AS is optional; the alias can follow the column name directly.",
        },
      ],
      predict_output: [
        {
          sql: 'SELECT salary AS "Pay" FROM employees WHERE department_id = 60;',
          correct_output: "A column labeled 'Pay' showing 4800, 6000, 6800.",
          explanation:
            "Alias only changes the header, not the filtering logic.",
        },
        {
          sql: "SELECT first_name fname FROM employees;",
          correct_output:
            "A column labeled 'FNAME' (Oracle uppercases unquoted aliases) showing all 6 first names.",
          explanation:
            "Without quotes, Oracle automatically uppercases the alias.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT salary AS 'Monthly Salary' FROM employees;",
          error: "Single quotes used instead of double quotes for the alias.",
          fixed_sql: 'SELECT salary AS "Monthly Salary" FROM employees;',
        },
        {
          broken_sql: "SELECT first_name AS First Name FROM employees;",
          error: "Alias with a space is not wrapped in quotes at all.",
          fixed_sql: 'SELECT first_name AS "First Name" FROM employees;',
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query that shows department_id with the header 'Department Number'.",
          expected_answer:
            'SELECT department_id AS "Department Number" FROM employees;',
        },
      ],
    },
    coding_challenge: {
      prompt: "Show hire_date with the column header 'Start Date'.",
      hints: ["Use AS", "Wrap the alias in double quotes since it has a space"],
    },
    expected_answer: 'SELECT hire_date AS "Start Date" FROM employees;',
    related_lessons: ["lesson_007", "lesson_009"],
  },
  {
    id: "lesson_009",
    phase: "phase_1",
    level: "beginner",
    lesson_number: 9,
    title: "Capstone: Multi-Clause Query Construction",
    difficulty: "medium",
    query_type: "Capstone - combining clauses",
    sql: 'SELECT first_name AS "Employee Name", salary AS "Salary" FROM employees WHERE department_id = 60 ORDER BY salary DESC;',
    short_description:
      "Show a friendly report of department 60's employees, filtered and sorted, with clean column headers.",
    real_world_use_case:
      "This exact pattern - filter, sort, and rename - is what powers most real business dashboards, like a sales team's leaderboard filtered to one region and sorted by top performer.",
    goal_of_this_query:
      "To combine everything learned in phase 1 - choosing columns, filtering with WHERE, sorting with ORDER BY, and renaming with AS - into one complete, realistic query.",
    before_learning: {
      required_knowledge: [
        "Lessons 1-8: SELECT, FROM, WHERE, comparison operators, ORDER BY, DESC, DISTINCT, aliases",
      ],
      new_concepts: [
        "How all previous clauses combine in the correct order: SELECT -> FROM -> WHERE -> ORDER BY",
      ],
    },
    keyword_breakdown: [
      {
        keyword: "clause order",
        meaning:
          "Oracle requires a strict order when clauses are combined: SELECT columns, FROM table, WHERE condition, ORDER BY sort - always in that sequence.",
        why_we_use_it:
          "This fixed order avoids confusion and lets Oracle parse the statement correctly every time.",
        easy_example:
          "Like a recipe: gather ingredients (SELECT), open the fridge (FROM), pick only fresh ones (WHERE), then arrange them on a plate a certain way (ORDER BY).",
        common_mistake:
          "Writing ORDER BY before WHERE, which is always a syntax error, no matter what.",
      },
    ],
    line_by_line_explanation: [
      'SELECT first_name AS "Employee Name", salary AS "Salary" -> choose 2 columns and rename their headers',
      "FROM employees -> from this table",
      "WHERE department_id = 60 -> only keep rows from department 60",
      "ORDER BY salary DESC -> sort the surviving rows by salary, highest first",
    ],
    execution_flow: [
      "Oracle opens employees.",
      "It applies WHERE first: keep only rows where department_id = 60 (David Austin, Bruce, David Lee survive; Steven, Neena, Lex are removed).",
      "It applies SELECT next: pick only first_name and salary from the 3 surviving rows.",
      "It applies ORDER BY: sort those 3 rows by salary, highest to lowest.",
      "Finally, it applies the aliases, renaming the headers for display.",
    ],
    fake_database: {
      table_name: "employees",
      columns: [
        "employee_id",
        "first_name",
        "last_name",
        "salary",
        "department_id",
        "hire_date",
      ],
      rows: [
        {
          employee_id: 100,
          first_name: "Steven",
          last_name: "King",
          salary: 24000,
          department_id: 90,
          hire_date: "1987-06-17",
        },
        {
          employee_id: 101,
          first_name: "Neena",
          last_name: "Kochhar",
          salary: 17000,
          department_id: 90,
          hire_date: "1989-09-21",
        },
        {
          employee_id: 102,
          first_name: "Lex",
          last_name: "De Haan",
          salary: 17000,
          department_id: 90,
          hire_date: "1993-01-13",
        },
        {
          employee_id: 103,
          first_name: "David",
          last_name: "Austin",
          salary: 4800,
          department_id: 60,
          hire_date: "2005-06-25",
        },
        {
          employee_id: 104,
          first_name: "Bruce",
          last_name: "Ernst",
          salary: 6000,
          department_id: 60,
          hire_date: "2007-05-21",
        },
        {
          employee_id: 105,
          first_name: "David",
          last_name: "Lee",
          salary: 6800,
          department_id: 60,
          hire_date: "2008-02-23",
        },
      ],
    },
    step_by_step_execution: [
      "Step 1: WHERE department_id = 60 keeps David Austin (4800), Bruce (6000), David Lee (6800); removes the 3 department-90 employees.",
      "Step 2: SELECT narrows each surviving row down to just first_name and salary.",
      "Step 3: ORDER BY salary DESC arranges the 3 rows: David Lee (6800) first, then Bruce (6000), then David Austin (4800).",
      "Step 4: The column headers are relabeled to 'Employee Name' and 'Salary' for the final display.",
    ],
    final_result: {
      columns: ["Employee Name", "Salary"],
      rows: [
        {
          "Employee Name": "David",
          Salary: 6800,
        },
        {
          "Employee Name": "Bruce",
          Salary: 6000,
        },
        {
          "Employee Name": "David",
          Salary: 4800,
        },
      ],
    },
    output_table: {
      ascii_table:
        "+---------------+--------+\n| Employee Name | Salary |\n+---------------+--------+\n|     David     |  6800  |\n|     Bruce     |  6000  |\n|     David     |  4800  |\n+---------------+--------+",
    },
    visual_explanation: {
      diagram:
        "employees (6 rows)\n   |\n   v\nWHERE department_id = 60  -> keep 3 rows\n   |\n   v\nSELECT first_name, salary -> narrow to 2 columns\n   |\n   v\nORDER BY salary DESC -> David Lee, Bruce, David Austin\n   |\n   v\nAS aliases -> headers become 'Employee Name' and 'Salary'\n   |\n   v\nFinal report",
    },
    important_rules: [
      "The correct written order is always: SELECT, FROM, WHERE, ORDER BY.",
      "Oracle's actual internal processing order is: FROM, WHERE, SELECT, ORDER BY - filtering happens before column selection and sorting happens last.",
      "Aliases defined in SELECT can be used in ORDER BY by their alias name in many cases, though referring to the original column name always works too.",
    ],
    things_to_remember: [
      "Think of WHERE as a bouncer at the door (decides who gets in) and ORDER BY as the seating arrangement (decides the order once inside).",
      "Aliases are purely cosmetic and applied at the very end, for display only.",
    ],
    common_beginner_mistakes: [
      "Writing the clauses out of order (e.g., ORDER BY before WHERE).",
      "Forgetting that WHERE filters using the REAL column name (department_id), not an alias, since WHERE is processed before aliases are applied.",
      "Assuming SELECT happens before WHERE, when actually WHERE's filtering logic is evaluated first.",
    ],
    how_to_modify_this_query: [
      {
        change: "Filter department 90 instead, ascending salary",
        new_sql:
          'SELECT first_name AS "Employee Name", salary AS "Salary" FROM employees WHERE department_id = 90 ORDER BY salary;',
        effect:
          "Now shows the 3 department-90 employees, sorted lowest salary first.",
      },
      {
        change: "Add a salary threshold on top of the department filter",
        new_sql:
          'SELECT first_name AS "Employee Name", salary AS "Salary" FROM employees WHERE department_id = 60 AND salary > 5000 ORDER BY salary DESC;',
        effect:
          "Introduces AND (covered in the next phase) to combine two conditions - only department 60 employees earning over 5000 appear, which excludes David Austin.",
      },
    ],
    practice_variations: [
      'SELECT first_name AS "Name", hire_date AS "Hired" FROM employees WHERE department_id = 90 ORDER BY hire_date;',
      'SELECT last_name AS "Last Name", salary AS "Pay" FROM employees WHERE salary > 5000 ORDER BY salary;',
    ],
    quiz: {
      mcq: [
        {
          question: "What is the correct written clause order in SQL?",
          options: [
            "FROM, SELECT, WHERE, ORDER BY",
            "SELECT, FROM, WHERE, ORDER BY",
            "WHERE, SELECT, FROM, ORDER BY",
            "ORDER BY, SELECT, FROM, WHERE",
          ],
          correct_answer: "SELECT, FROM, WHERE, ORDER BY",
          explanation: "This is the fixed, required written order in SQL.",
        },
        {
          question:
            "Which happens first internally: WHERE filtering or column selection?",
          options: [
            "Column selection first",
            "WHERE filtering first",
            "They happen simultaneously",
            "Neither happens",
          ],
          correct_answer: "WHERE filtering first",
          explanation:
            "Oracle filters rows before finalizing which columns to display.",
        },
        {
          question: "Can WHERE use an alias defined in SELECT?",
          options: [
            "Yes, always",
            "No, WHERE must use the real column name",
            "Only for text columns",
            "Only in Oracle 19c+",
          ],
          correct_answer: "No, WHERE must use the real column name",
          explanation:
            "WHERE is evaluated before aliases exist, so it needs the original column name.",
        },
        {
          question: "What does this capstone query filter by?",
          options: [
            "salary only",
            "department_id only",
            "first_name only",
            "No filter at all",
          ],
          correct_answer: "department_id only",
          explanation: "WHERE department_id = 60 is the only filter condition.",
        },
        {
          question: "In the final result, who has the highest salary?",
          options: ["David Austin", "Bruce", "David Lee", "Steven"],
          correct_answer: "David Lee",
          explanation:
            "Among department 60 employees, David Lee earns the most (6800).",
        },
      ],
      true_false: [
        {
          statement: "ORDER BY can be placed before WHERE and still work.",
          answer: false,
          explanation:
            "That would be a syntax error - WHERE always comes before ORDER BY.",
        },
        {
          statement: "This query only shows employees from department 60.",
          answer: true,
          explanation:
            "Correct - the WHERE clause filters to department_id = 60.",
        },
        {
          statement:
            "The column headers 'Employee Name' and 'Salary' are permanently renamed in the table.",
          answer: false,
          explanation: "Aliases are temporary, only for this query's display.",
        },
      ],
      predict_output: [
        {
          sql: 'SELECT first_name AS "Name" FROM employees WHERE department_id = 90 ORDER BY first_name;',
          correct_output:
            "Lex, Neena, Steven (alphabetical order, department 90 only).",
          explanation:
            "Filters to department 90, then sorts alphabetically by first_name.",
        },
        {
          sql: 'SELECT salary AS "Pay" FROM employees WHERE salary > 6000 ORDER BY salary;',
          correct_output:
            "6800, 17000, 17000, 24000 (ascending, only salaries above 6000).",
          explanation:
            "WHERE keeps salaries over 6000, ORDER BY sorts them ascending.",
        },
      ],
      find_error: [
        {
          broken_sql:
            "SELECT first_name FROM employees ORDER BY salary DESC WHERE department_id = 60;",
          error: "ORDER BY is written before WHERE - invalid clause order.",
          fixed_sql:
            "SELECT first_name FROM employees WHERE department_id = 60 ORDER BY salary DESC;",
        },
        {
          broken_sql:
            'SELECT first_name AS "Employee Name" FROM employees WHERE "Employee Name" = \'Bruce\';',
          error:
            "WHERE tries to use the alias 'Employee Name' instead of the real column first_name.",
          fixed_sql:
            "SELECT first_name AS \"Employee Name\" FROM employees WHERE first_name = 'Bruce';",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query showing last_name (aliased as 'Surname') and salary for department 90, sorted by salary ascending.",
          expected_answer:
            'SELECT last_name AS "Surname", salary FROM employees WHERE department_id = 90 ORDER BY salary;',
        },
      ],
    },
    coding_challenge: {
      prompt:
        "Show first_name (aliased as 'Name') and salary for employees earning more than 5000, sorted by salary descending.",
      hints: [
        "WHERE salary > 5000",
        "ORDER BY salary DESC",
        "Alias goes in the SELECT list",
      ],
    },
    expected_answer:
      'SELECT first_name AS "Name", salary FROM employees WHERE salary > 5000 ORDER BY salary DESC;',
    related_lessons: ["lesson_008", "lesson_010"],
  },
];

// PROGRAMMATIC LESSONS GENERATION ENGINE FOR LEVELS 10 TO 150
const RAW_P1_TOPICS = [
  {
    title: "Range Filtering with BETWEEN",
    sql: "SELECT first_name, last_name, salary FROM employees WHERE salary BETWEEN 5000 AND 10000;",
    use: "HR managers use BETWEEN to find middle-management candidates eligible for basic salary reviews.",
    desc: "Filter employees whose salary is between 5000 and 10000.",
  },
  {
    title: "Highest Salary using MAX",
    sql: "SELECT MAX(salary) AS highest_salary FROM employees;",
    use: "Executive teams use MAX to understand the upper boundary of payroll compensation.",
    desc: "Calculate the maximum salary among all employees.",
  },
  {
    title: "Salary Stats by Department",
    sql: "SELECT department_id, MIN(salary) AS min_salary, MAX(salary) AS max_salary, AVG(salary) AS avg_salary FROM employees GROUP BY department_id;",
    use: "Finance officers analyze department budget ranges and average salaries.",
    desc: "Group employees by department and calculate salary stats.",
  },
  {
    title: "Format Last Name in Uppercase",
    sql: "SELECT first_name, UPPER(last_name) AS upper_last_name FROM employees;",
    use: "Reports use uppercase for uniform printing.",
    desc: "Format the last name column to be uppercase.",
  },
  {
    title: "Filter Hires after 2005",
    sql: "SELECT first_name, hire_date FROM employees WHERE hire_date > DATE '2005-01-01' ORDER BY hire_date ASC;",
    use: "Recruitment tracks employee tenure cohorts.",
    desc: "Find employees hired after 2005 and sort.",
  },
  {
    title: "Handle Nulls with COALESCE",
    sql: "SELECT first_name, salary, COALESCE(commission_pct, 0) AS commission FROM employees;",
    use: "Sales calculate commissions safely.",
    desc: "Replace null commission values with zero.",
  },
  {
    title: "Filter set with IN operator",
    sql: "SELECT first_name, last_name, department_id FROM employees WHERE department_id IN (10, 20, 50);",
    use: "Regional managers filter employees by department sets.",
    desc: "Filter employees who belong to departments 10, 20, or 50.",
  },
  {
    title: "Sort by Department and Salary",
    sql: "SELECT first_name, last_name, department_id, salary FROM employees ORDER BY department_id ASC, salary DESC;",
    use: "Auditors prepare payroll sorted by department and highest salary.",
    desc: "Sort by department ascending and salary descending.",
  },
  {
    title: "Count Staff per Job Category",
    sql: "SELECT job_id, COUNT(*) AS employee_count FROM employees GROUP BY job_id;",
    use: "Workforce planners monitor job distributions.",
    desc: "Count active employees per job category.",
  },
  {
    title: "Filtering Groups with HAVING",
    sql: "SELECT department_id, AVG(salary) AS average_salary FROM employees GROUP BY department_id HAVING AVG(salary) > 8000;",
    use: "Auditors review high-paying departments.",
    desc: "List departments with average salary over 8000.",
  },
  {
    title: "Concatenate full employee names",
    sql: "SELECT first_name || ' ' || last_name AS full_name FROM employees;",
    use: "Mailing systems merge name components.",
    desc: "Concatenate first and last name into full_name.",
  },
  {
    title: "Inner Join: Staff and Depts",
    sql: "SELECT e.first_name, e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id;",
    use: "Directories map employees to departments.",
    desc: "Retrieve employees and department names via inner join.",
  },
  {
    title: "Sequencing Three Table Joins",
    sql: "SELECT e.first_name, e.last_name, d.department_name, l.city FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN locations l ON d.location_id = l.location_id;",
    use: "Corporate directories display city locations of staff.",
    desc: "Join employees, departments, and locations.",
  },
  {
    title: "Join: Employee Jobs",
    sql: "SELECT e.first_name, e.last_name, j.job_title FROM employees e JOIN jobs j ON e.job_id = j.job_id;",
    use: "Profile details map job IDs to descriptions.",
    desc: "Fetch employee names and their job titles.",
  },
  {
    title: "Left Join: Unassigned Staff",
    sql: "SELECT e.first_name, d.department_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id;",
    use: "Onboarding tracking identifies new employees without departments.",
    desc: "List all employees, keeping those without departments.",
  },
  {
    title: "Left Join: Empty Departments",
    sql: "SELECT d.department_name, e.first_name FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id;",
    use: "Restructuring checkers find empty departments.",
    desc: "List all departments and any assigned staff.",
  },
  {
    title: "Self Join: Staff Managers",
    sql: "SELECT e.first_name AS employee_name, m.first_name AS manager_name FROM employees e JOIN employees m ON e.manager_id = m.employee_id;",
    use: "Hierarchical generators build reporting flow charts.",
    desc: "Join employees with itself to find manager names.",
  },
  {
    title: "Cross Join: Permutation Matrix",
    sql: "SELECT e.first_name, e.last_name, d.department_name FROM employees e CROSS JOIN departments d;",
    use: "Security compliance maps all profiles to all teams.",
    desc: "Map every employee to every department.",
  },
  {
    title: "Non-Equi Join: Salary Ranges",
    sql: "SELECT e.first_name, e.salary, j.job_title FROM employees e JOIN jobs j ON e.salary BETWEEN j.min_salary AND j.max_salary;",
    use: "Consultants verify salary alignments.",
    desc: "Match salaries with min/max job grades.",
  },
  {
    title: "Full Outer Join: Complete Matches",
    sql: "SELECT e.first_name, d.department_name FROM employees e FULL OUTER JOIN departments d ON e.department_id = d.department_id;",
    use: "Data cleaning aligns orphan records.",
    desc: "Fetch matches, unassigned staff, and empty depts.",
  },
  {
    title: "Joined Filtering with WHERE",
    sql: "SELECT e.first_name, e.last_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id WHERE d.department_name = 'IT';",
    use: "Engineering leads filter staff in IT.",
    desc: "Retrieve employees working in IT department.",
  },
  {
    title: "Scalar Subquery: Above Average",
    sql: "SELECT first_name, last_name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);",
    use: "Bonus planners analyze high earners.",
    desc: "Retrieve employees earning more than the average salary.",
  },
  {
    title: "Subquery with WHERE Equals",
    sql: "SELECT first_name, last_name FROM employees WHERE department_id = (SELECT department_id FROM departments WHERE department_name = 'IT');",
    use: "Dynamic lookups match records on label names.",
    desc: "Get employees in the IT department.",
  },
  {
    title: "Subquery list with IN",
    sql: "SELECT first_name, last_name FROM employees WHERE department_id IN (SELECT department_id FROM departments WHERE location_id = 1700);",
    use: "Compliance checks localized regional staff.",
    desc: "Find employees in departments located at 1700.",
  },
  {
    title: "List comparisons using ANY",
    sql: "SELECT first_name, last_name, salary FROM employees WHERE salary > ANY (SELECT salary FROM employees WHERE department_id = 60);",
    use: "Compensation charts find salary overlaps.",
    desc: "Find employees earning more than any IT programmer.",
  },
  {
    title: "List comparisons using ALL",
    sql: "SELECT first_name, last_name, salary FROM employees WHERE salary > ALL (SELECT salary FROM employees WHERE department_id = 60);",
    use: "Recruiting checks bounds against job ceilings.",
    desc: "Find employees earning more than all IT programmers.",
  },
  {
    title: "Correlated Subquery: Department Avg",
    sql: "SELECT e.first_name, e.last_name, e.salary FROM employees e WHERE e.salary > (SELECT AVG(salary) FROM employees WHERE department_id = e.department_id);",
    use: "Performance review maps high earners to peer averages.",
    desc: "Find employees out-earning their department averages.",
  },
  {
    title: "Row verification with EXISTS",
    sql: "SELECT department_name FROM departments d WHERE EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);",
    use: "Facilities allocate resources to departments with staff.",
    desc: "Find departments that have assigned employees.",
  },
  {
    title: "Row verification with NOT EXISTS",
    sql: "SELECT department_name FROM departments d WHERE NOT EXISTS (SELECT 1 FROM employees e WHERE e.department_id = d.department_id);",
    use: "Audit releases empty cost center allocations.",
    desc: "Find departments with zero employees.",
  },
  {
    title: "Scalar Subquery in SELECT list",
    sql: "SELECT e.first_name, (SELECT d.department_name FROM departments d WHERE d.department_id = e.department_id) AS dept_name FROM employees e;",
    use: "Feeds display related labels without joins.",
    desc: "Display employees and their department names inline.",
  },
  {
    title: "Inline views in FROM clause",
    sql: "SELECT emp_count FROM (SELECT COUNT(*) AS emp_count FROM employees);",
    use: "Advanced reporting pools aggregates before math.",
    desc: "Treat a subquery as a temporary table.",
  },
  {
    title: "Department Payroll Sum with SUM",
    sql: "SELECT department_id, SUM(salary) AS total_payroll FROM employees GROUP BY department_id;",
    use: "C-Suite reviews budget payroll per department.",
    desc: "Retrieve total payroll expense per department.",
  },
  {
    title: "Average salaries using HAVING",
    sql: "SELECT job_id, AVG(salary) AS avg_sal FROM employees GROUP BY job_id HAVING AVG(salary) > 5000;",
    use: "HR sets grade brackets according to role averages.",
    desc: "Group averages filtered for values above 5000.",
  },
  {
    title: "Ranking Salaries with RANK()",
    sql: "SELECT first_name, salary, RANK() OVER (ORDER BY salary DESC) AS sal_rank FROM employees;",
    use: "Leaderboards rank participants with duplicate ties.",
    desc: "Rank employee salaries, leaving gaps for ties.",
  },
  {
    title: "Consecutive Ranking: DENSE_RANK()",
    sql: "SELECT first_name, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS sal_dense_rank FROM employees;",
    use: "Auditors assign awards consecutively.",
    desc: "Rank salaries consecutively without leaving gaps.",
  },
  {
    title: "Local Partition Averages",
    sql: "SELECT first_name, department_id, salary, AVG(salary) OVER (PARTITION BY department_id) AS dept_avg FROM employees;",
    use: "Checks pay equity benchmarks within teams.",
    desc: "Display team average on every employee row.",
  },
  {
    title: "Prior row offsets with LAG()",
    sql: "SELECT first_name, salary, LAG(salary, 1) OVER (ORDER BY salary) AS prev_salary FROM employees;",
    use: "Dashboards analyze trends across sorted lists.",
    desc: "Fetch salary of the prior row in sorted list.",
  },
  {
    title: "Future row offsets with LEAD()",
    sql: "SELECT first_name, salary, LEAD(salary, 1) OVER (ORDER BY salary) AS next_salary FROM employees;",
    use: "Trend models verify next milestones.",
    desc: "Fetch salary of the subsequent row in sorted list.",
  },
  {
    title: "Subtotal rollup aggregations",
    sql: "SELECT department_id, job_id, SUM(salary) AS payroll FROM employees GROUP BY ROLLUP(department_id, job_id);",
    use: "Accountants print charts with department subtotals.",
    desc: "Generate group totals and grand totals.",
  },
  {
    title: "Permuted subtotals with CUBE()",
    sql: "SELECT department_id, job_id, SUM(salary) AS payroll FROM employees GROUP BY CUBE(department_id, job_id);",
    use: "Analytics engines build pivoting spreadsheets.",
    desc: "Generate all possible total pairings.",
  },
  {
    title: "Value mapping with CASE",
    sql: "SELECT first_name, CASE WHEN salary > 15000 THEN 'High' WHEN salary > 6000 THEN 'Medium' ELSE 'Low' END AS salary_tier FROM employees;",
    use: "Mailing systems split cohorts into tiers dynamically.",
    desc: "Assign descriptive salary categories.",
  },
];

const RAW_P2_TOPICS = [
  {
    title: "PL/SQL Hello World Block",
    sql: "DECLARE\n  v_msg VARCHAR2(50) := 'Hello, PL/SQL!';\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_msg);\nEND;",
    use: "Engineers test server print configurations.",
    desc: "Run a basic anonymous PL/SQL block printing text.",
  },
  {
    title: "Variables and Constants",
    sql: "DECLARE\n  v_salary NUMBER := 5000;\n  c_tax CONSTANT NUMBER := 0.15;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_salary * (1 - c_tax));\nEND;",
    use: "Calculates values with unchanging standards.",
    desc: "Declare and multiply using typed variables.",
  },
  {
    title: "Anchored Types with %TYPE",
    sql: "DECLARE\n  v_name employees.first_name%TYPE;\nBEGIN\n  SELECT first_name INTO v_name FROM employees WHERE employee_id = 100;\n  DBMS_OUTPUT.PUT_LINE(v_name);\nEND;",
    use: "Insulates code from database column alterations.",
    desc: "Declare variable anchored to table column type.",
  },
  {
    title: "Record Types with %ROWTYPE",
    sql: "DECLARE\n  v_rec employees%ROWTYPE;\nBEGIN\n  SELECT * INTO v_rec FROM employees WHERE employee_id = 100;\n  DBMS_OUTPUT.PUT_LINE(v_rec.first_name);\nEND;",
    use: "Queries complete rows into single typed variables.",
    desc: "Hold full table records in a ROWTYPE record.",
  },
  {
    title: "Custom PL/SQL Records",
    sql: "DECLARE\n  TYPE t_rec IS RECORD (name VARCHAR2(50), sal NUMBER);\n  v_obj t_rec;\nBEGIN\n  SELECT first_name, salary INTO v_obj FROM employees WHERE employee_id = 100;\nEND;",
    use: "Groups disparate query outputs into custom models.",
    desc: "Declare custom structural data records.",
  },
  {
    title: "Single Row Fetch: SELECT INTO",
    sql: "DECLARE\n  v_sal employees.salary%TYPE;\nBEGIN\n  SELECT salary INTO v_sal FROM employees WHERE employee_id = 101;\nEND;",
    use: "Fetches matching configurations into session variables.",
    desc: "Fetch a single row using SELECT INTO.",
  },
  {
    title: "Arithmetic in PL/SQL",
    sql: "DECLARE\n  v_x NUMBER := 10;\n  v_y NUMBER := 3;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE('Result: ' || (v_x * v_y));\nEND;",
    use: "Processes math values in server execution pipelines.",
    desc: "Perform mathematical calculations in PL/SQL.",
  },
  {
    title: "Boolean Logic Expressions",
    sql: "DECLARE\n  v_active BOOLEAN := TRUE;\nBEGIN\n  IF v_active THEN\n    DBMS_OUTPUT.PUT_LINE('Active');\n  END IF;\nEND;",
    use: "Manages logical state gates inside transactions.",
    desc: "Use Boolean variables in decision logic.",
  },
  {
    title: "Formatting Dates inside Blocks",
    sql: "DECLARE\n  v_today DATE := SYSDATE;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(TO_CHAR(v_today, 'YYYY-MM-DD'));\nEND;",
    use: "Enforces localization rules on report timestamps.",
    desc: "Format dates inside PL/SQL procedures.",
  },
  {
    title: "Bind Variables Interaction",
    sql: "DECLARE\n  v_input VARCHAR2(100) := :BIND_VAR;\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_input);\nEND;",
    use: "Transfers values dynamically from host systems.",
    desc: "Interface PL/SQL block with host bind variables.",
  },
  {
    title: "Conditional IF-THEN structure",
    sql: "DECLARE\n  v_sal NUMBER := 15000;\nBEGIN\n  IF v_sal > 10000 THEN\n    DBMS_OUTPUT.PUT_LINE('High');\n  END IF;\nEND;",
    use: "Branches code routing based on metrics.",
    desc: "Filter processes using IF-THEN loops.",
  },
  {
    title: "Conditional IF-THEN-ELSE decision",
    sql: "DECLARE\n  v_score NUMBER := 85;\nBEGIN\n  IF v_score >= 90 THEN\n    DBMS_OUTPUT.PUT_LINE('A');\n  ELSE\n    DBMS_OUTPUT.PUT_LINE('B');\n  END IF;\nEND;",
    use: "Enforces binary choices inside business logic rules.",
    desc: "Decide routes using IF-THEN-ELSE.",
  },
  {
    title: "Multi-branch IF-THEN-ELSIF logic",
    sql: "DECLARE\n  v_score NUMBER := 85;\nBEGIN\n  IF v_score >= 90 THEN DBMS_OUTPUT.PUT_LINE('A');\n  ELSIF v_score >= 80 THEN DBMS_OUTPUT.PUT_LINE('B');\n  ELSE DBMS_OUTPUT.PUT_LINE('C');\n  END IF;\nEND;",
    use: "Scores tiers consecutively according to rules.",
    desc: "Route processes across multiple conditions.",
  },
  {
    title: "CASE Statements in PL/SQL",
    sql: "DECLARE\n  v_dept_id NUMBER := 20;\n  v_name VARCHAR2(50);\nBEGIN\n  v_name := CASE v_dept_id WHEN 10 THEN 'Admin' WHEN 20 THEN 'Marketing' ELSE 'Other' END;\nEND;",
    use: "Evaluates exact match lists efficiently.",
    desc: "Evaluate options using matching CASE selectors.",
  },
  {
    title: "Complex CASE Expressions",
    sql: "DECLARE\n  v_sal NUMBER := 12000;\n  v_tier VARCHAR2(20);\nBEGIN\n  v_tier := CASE WHEN v_sal > 15000 THEN 'Gold' WHEN v_sal > 5000 THEN 'Silver' ELSE 'Bronze' END;\nEND;",
    use: "Translates ranges into discrete label outputs.",
    desc: "Determine categories with complex CASE parameters.",
  },
  {
    title: "Basic LOOP with EXIT WHEN",
    sql: "DECLARE\n  v_counter NUMBER := 1;\nBEGIN\n  LOOP\n    v_counter := v_counter + 1;\n    EXIT WHEN v_counter > 5;\n  END LOOP;\nEND;",
    use: "Iterates transactions recursively until done.",
    desc: "Repeat operations using standard LOOP logic.",
  },
  {
    title: "WHILE Loops inside Blocks",
    sql: "DECLARE\n  v_idx NUMBER := 1;\nBEGIN\n  WHILE v_idx <= 5 LOOP\n    v_idx := v_idx + 1;\n  END LOOP;\nEND;",
    use: "Guarantees loops exit safely as states shift.",
    desc: "Verify loop criteria before each iteration.",
  },
  {
    title: "Numeric FOR Loop iterations",
    sql: "BEGIN\n  FOR i IN 1..5 LOOP\n    DBMS_OUTPUT.PUT_LINE(i);\n  END LOOP;\nEND;",
    use: "Executes fixed loops over index tables cleanly.",
    desc: "Repeat steps a pre-calculated number of times.",
  },
  {
    title: "Reverse Numeric FOR Loops",
    sql: "BEGIN\n  FOR i IN REVERSE 1..5 LOOP\n    DBMS_OUTPUT.PUT_LINE(i);\n  END LOOP;\nEND;",
    use: "Reverts processes from leaf nodes upwards.",
    desc: "Loop backwards from high bound to low.",
  },
  {
    title: "Nested Loops with Labels",
    sql: "<<outer_lbl>> FOR i IN 1..3 LOOP\n  <<inner_lbl>> FOR j IN 1..2 LOOP\n    DBMS_OUTPUT.PUT_LINE(i || '-' || j);\n  END LOOP inner_lbl;\nEND LOOP outer_lbl;",
    use: "Controls priority loops in nested trees.",
    desc: "Label loops to enable specific control targets.",
  },
  {
    title: "Skip Iterations with CONTINUE",
    sql: "BEGIN\n  FOR i IN 1..5 LOOP\n    IF i = 3 THEN CONTINUE; END IF;\n    DBMS_OUTPUT.PUT_LINE(i);\n  END LOOP;\nEND;",
    use: "Bypasses specific items during loop filters.",
    desc: "Jump to next loop iteration immediately.",
  },
  {
    title: "Declaring Explicit Cursors",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT first_name FROM employees;\n  v_name employees.first_name%TYPE;\nBEGIN\n  OPEN c_emp; FETCH c_emp INTO v_name; CLOSE c_emp;\nEND;",
    use: "Streams dataset row pipelines into system memory.",
    desc: "Declare explicit SQL row cursors.",
  },
  {
    title: "Cursor loop and close steps",
    sql: "DECLARE\n  CURSOR c_dept IS SELECT department_name FROM departments;\n  v_name departments.department_name%TYPE;\nBEGIN\n  OPEN c_dept; LOOP FETCH c_dept INTO v_name; EXIT WHEN c_dept%NOTFOUND; END LOOP; CLOSE c_dept;\nEND;",
    use: "Fetches multi-row configurations step-by-step.",
    desc: "Open, fetch, and close explicit cursor sets.",
  },
  {
    title: "Cursor attributes: %FOUND check",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT first_name FROM employees;\n  v_name employees.first_name%TYPE;\nBEGIN\n  OPEN c_emp; FETCH c_emp INTO v_name;\n  IF c_emp%FOUND THEN DBMS_OUTPUT.PUT_LINE(v_name); END IF;\n  CLOSE c_emp;\nEND;",
    use: "Validates if records are still flowing in.",
    desc: "Verify item presence using cursor %FOUND.",
  },
  {
    title: "Cursor attributes: %ROWCOUNT values",
    sql: "DECLARE\n  CURSOR c_jobs IS SELECT job_title FROM jobs;\n  v_title jobs.job_title%TYPE;\nBEGIN\n  OPEN c_jobs;\n  LOOP FETCH c_jobs INTO v_title; EXIT WHEN c_jobs%NOTFOUND;\n    DBMS_OUTPUT.PUT_LINE(c_jobs%ROWCOUNT);\n  END LOOP; CLOSE c_jobs;\nEND;",
    use: "Saves transaction counts during batch updates.",
    desc: "Track row count metrics using %ROWCOUNT.",
  },
  {
    title: "Streamlining with Cursor FOR Loops",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT first_name FROM employees;\nBEGIN\n  FOR r_emp IN c_emp LOOP\n    DBMS_OUTPUT.PUT_LINE(r_emp.first_name);\n  END LOOP;\nEND;",
    use: "Guarantees no memory leaks from open cursors.",
    desc: "Automate cursor lifecycle via Cursor FOR loops.",
  },
  {
    title: "Inline Cursor FOR Loops",
    sql: "BEGIN\n  FOR r_dept IN (SELECT department_name FROM departments) LOOP\n    DBMS_OUTPUT.PUT_LINE(r_dept.department_name);\n  END LOOP;\nEND;",
    use: "Write highly readable looping procedures quickly.",
    desc: "Iterate inline SELECT arrays automatically.",
  },
  {
    title: "Parameterized Cursors",
    sql: "DECLARE\n  CURSOR c_emp(p_id NUMBER) IS SELECT first_name FROM employees WHERE department_id = p_id;\nBEGIN\n  FOR r_emp IN c_emp(60) LOOP DBMS_OUTPUT.PUT_LINE(r_emp.first_name); END LOOP;\nEND;",
    use: "Reuses SQL statements with differing criteria.",
    desc: "Pass variables directly into explicit cursors.",
  },
  {
    title: "Locking Rows with FOR UPDATE",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT salary FROM employees WHERE employee_id = 100 FOR UPDATE;\nBEGIN\n  NULL;\nEND;",
    use: "Secures concurrency records during money transfers.",
    desc: "Lock target rows during transactional cycles.",
  },
  {
    title: "Conditional Cursor Handling",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT first_name, salary FROM employees;\nBEGIN\n  FOR r_emp IN c_emp LOOP\n    IF r_emp.salary > 10000 THEN DBMS_OUTPUT.PUT_LINE(r_emp.first_name); END IF;\n  END LOOP;\nEND;",
    use: "Triggers actions as cursor states shift.",
    desc: "Apply logic criteria while parsing cursor rows.",
  },
  {
    title: "Cursor Joins: Multi-table schemas",
    sql: "DECLARE\n  CURSOR c_joined IS SELECT e.first_name, d.department_name FROM employees e JOIN departments d ON e.department_id = d.department_id;\nBEGIN\n  FOR r IN c_joined LOOP DBMS_OUTPUT.PUT_LINE(r.first_name); END LOOP;\nEND;",
    use: "Consolidates complex reports into single loops.",
    desc: "Fetch joined table records in explicit cursors.",
  },
  {
    title: "Handling ZERO_DIVIDE Exceptions",
    sql: "DECLARE\n  v_num NUMBER;\nBEGIN\n  v_num := 10 / 0;\nEXCEPTION\n  WHEN ZERO_DIVIDE THEN DBMS_OUTPUT.PUT_LINE('Zero Division');\nEND;",
    use: "Keeps servers online when calculations fail.",
    desc: "Intercept math divide-by-zero failures.",
  },
  {
    title: "Handling NO_DATA_FOUND anomalies",
    sql: "DECLARE\n  v_name VARCHAR2(100);\nBEGIN\n  SELECT first_name INTO v_name FROM employees WHERE employee_id = 999;\nEXCEPTION\n  WHEN NO_DATA_FOUND THEN DBMS_OUTPUT.PUT_LINE('No Data');\nEND;",
    use: "Displays clean warnings when lookups return empty.",
    desc: "Catch missing record errors gracefully.",
  },
  {
    title: "Handling TOO_MANY_ROWS errors",
    sql: "DECLARE\n  v_name VARCHAR2(100);\nBEGIN\n  SELECT first_name INTO v_name FROM employees;\nEXCEPTION\n  WHEN TOO_MANY_ROWS THEN DBMS_OUTPUT.PUT_LINE('Too Many Rows');\nEND;",
    use: "Triggers list overrides when scalars fail.",
    desc: "Handle multi-row returns on single INTO requests.",
  },
  {
    title: "Declaring custom exceptions",
    sql: "DECLARE\n  e_low EXCEPTION;\n  v_bal NUMBER := 50;\nBEGIN\n  IF v_bal < 100 THEN RAISE e_low; END IF;\nEXCEPTION\n  WHEN e_low THEN DBMS_OUTPUT.PUT_LINE('Low Balance');\nEND;",
    use: "Enforces unique business constraints safely.",
    desc: "Declare and trigger user-defined exceptions.",
  },
  {
    title: "Exception binding: EXCEPTION_INIT",
    sql: "DECLARE\n  e_fk_error EXCEPTION;\n  PRAGMA EXCEPTION_INIT(e_fk_error, -2292);\nBEGIN\n  NULL;\nEXCEPTION\n  WHEN e_fk_error THEN DBMS_OUTPUT.PUT_LINE('FK Error');\nEND;",
    use: "Associates custom variables with system database errors.",
    desc: "Bind Oracle system codes to custom exception handlers.",
  },
  {
    title: "Error Codes: SQLCODE and SQLERRM",
    sql: "DECLARE\n  v_code NUMBER;\n  v_msg VARCHAR2(200);\nBEGIN\n  SELECT first_name INTO v_msg FROM employees WHERE employee_id = 999;\nEXCEPTION\n  WHEN OTHERS THEN\n    v_code := SQLCODE; v_msg := SQLERRM;\n    DBMS_OUTPUT.PUT_LINE(v_code || ': ' || v_msg);\nEND;",
    use: "Saves details in central system logger catalogs.",
    desc: "Access the error number and message programmatically.",
  },
  {
    title: "Exception Containment in Blocks",
    sql: "BEGIN\n  BEGIN\n    SELECT first_name INTO ...\n  EXCEPTION WHEN NO_DATA_FOUND THEN NULL; END;\nEND;",
    use: "Isolates minor failures from halting entire programs.",
    desc: "Enclose exception logic inside nested blocks.",
  },
  {
    title: "Raising Errors: RAISE_APPLICATION_ERROR",
    sql: "BEGIN\n  RAISE_APPLICATION_ERROR(-20001, 'Invalid transaction!');\nEND;",
    use: "Stops execution and sends clear warnings to callers.",
    desc: "Throw customized Oracle database errors.",
  },
  {
    title: "Retrying transactions in exceptions",
    sql: "DECLARE\n  v_tries NUMBER := 1;\nBEGIN\n  NULL;\nEND;",
    use: "Re-attempts transactions on network blips.",
    desc: "Simulate procedure retries inside handlers.",
  },
  {
    title: "Logging errors to table databases",
    sql: "DECLARE\n  v_err VARCHAR2(200);\nBEGIN\n  NULL;\nEND;",
    use: "Audits historical anomalies for debugging.",
    desc: "Log error trace parameters to table storage.",
  },
  {
    title: "Creating Stored Procedures",
    sql: "CREATE PROCEDURE adjust_salary (p_emp_id IN NUMBER, p_percent IN NUMBER) IS\nBEGIN\n  UPDATE employees SET salary = salary * (1 + p_percent/100) WHERE employee_id = p_emp_id;\nEND;",
    use: "Exposes reusable business APIs across systems.",
    desc: "Declare reusable stored procedure objects.",
  },
  {
    title: "Stored Functions returning values",
    sql: "CREATE FUNCTION get_annual_sal (p_emp_id IN NUMBER) RETURN NUMBER IS\n  v_sal NUMBER;\nBEGIN\n  SELECT salary * 12 INTO v_sal FROM employees WHERE employee_id = p_emp_id;\n  RETURN v_sal;\nEND;",
    use: "Calculates metric values dynamically inside SQL queries.",
    desc: "Create reusable PL/SQL function objects.",
  },
  {
    title: "PL/SQL Package Specifications",
    sql: "CREATE PACKAGE emp_pkg IS\n  PROCEDURE list_emps;\n  FUNCTION get_count RETURN NUMBER;\nEND emp_pkg;",
    use: "Organizes modular APIs into logical packages.",
    desc: "Declare public interface specifications.",
  },
  {
    title: "PL/SQL Package Body design",
    sql: "CREATE PACKAGE BODY emp_pkg IS\n  PROCEDURE list_emps IS BEGIN NULL; END;\n  FUNCTION get_count RETURN NUMBER IS BEGIN RETURN 10; END;\nEND emp_pkg;",
    use: "Hides complex business operations behind simple APIs.",
    desc: "Implement package interfaces programmatically.",
  },
  {
    title: "BEFORE INSERT row trigger constraints",
    sql: "CREATE TRIGGER trg_audit_emp BEFORE INSERT ON employees FOR EACH ROW\nBEGIN\n  NULL;\nEND;",
    use: "Auto-generates sequential key IDs on inserts.",
    desc: "Create triggers executing before rows are added.",
  },
  {
    title: "Enforcing checks with BEFORE UPDATE",
    sql: "CREATE TRIGGER trg_sal_check BEFORE UPDATE OF salary ON employees FOR EACH ROW\nBEGIN\n  IF :NEW.salary < :OLD.salary THEN\n    RAISE_APPLICATION_ERROR(-20002, 'Salary cannot decrease');\n  END IF;\nEND;",
    use: "Prevents illegal updates on financial balances.",
    desc: "Enforce custom validations on updates.",
  },
  {
    title: "AFTER INSERT statement triggers",
    sql: "CREATE TRIGGER trg_dept_log AFTER INSERT ON departments\nBEGIN\n  NULL;\nEND;",
    use: "Refreshes system-wide statistic aggregates on completions.",
    desc: "Run actions after operations finish.",
  },
  {
    title: "Associative Arrays (Index-by Tables)",
    sql: "DECLARE\n  TYPE t_names IS TABLE OF VARCHAR2(50) INDEX BY PLS_INTEGER;\n  v_list t_names;\nBEGIN\n  v_list(1) := 'John';\n  DBMS_OUTPUT.PUT_LINE(v_list(1));\nEND;",
    sql_command: "DECLARE...",
    instruction: "Loop associative indexes",
    desc: "Declare associative array variables inside PL/SQL.",
  },
  {
    title: "Declaring Nested Tables",
    sql: "DECLARE\n  TYPE t_nested IS TABLE OF NUMBER;\n  v_scores t_nested := t_nested(90, 85, 95);\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_scores(1));\nEND;",
    use: "Saves ordered collections within relational columns.",
    desc: "Use bounded nested table collection structures.",
  },
  {
    title: "Varrays (Variable-Size Arrays) limits",
    sql: "DECLARE\n  TYPE t_varray IS VARRAY(5) OF VARCHAR2(20);\n  v_days t_varray := t_varray('Mon', 'Tue');\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(v_days.COUNT);\nEND;",
    use: "Stores fixed collections (like days of the week) cleanly.",
    desc: "Declare Varray structures with fixed size bounds.",
  },
];

const RAW_P3_TOPICS = [
  {
    title: "Dynamic SQL EXECUTE IMMEDIATE",
    sql: "BEGIN\n  EXECUTE IMMEDIATE 'ALTER SESSION SET NLS_DATE_FORMAT = ''YYYY-MM-DD''';\nEND;",
    use: "Updates session parameters programmatically.",
    desc: "Execute text command strings dynamically.",
  },
  {
    title: "EXECUTE IMMEDIATE with USING bindings",
    sql: "DECLARE\n  v_sql VARCHAR2(200); v_name VARCHAR2(50);\nBEGIN\n  v_sql := 'SELECT first_name FROM employees WHERE employee_id = :id';\n  EXECUTE IMMEDIATE v_sql INTO v_name USING 100;\nEND;",
    use: "Secures search interfaces against security injections.",
    desc: "Bind parameters dynamically into SQL queries.",
  },
  {
    title: "Dynamic SQL with RETURNING INTO",
    sql: "DECLARE\n  v_sql VARCHAR2(200); v_new_sal NUMBER;\nBEGIN\n  v_sql := 'UPDATE employees SET salary = salary * 1.1 WHERE employee_id = :id RETURNING salary INTO :out';\n  EXECUTE IMMEDIATE v_sql USING 100 RETURNING INTO v_new_sal;\nEND;",
    use: "Fetches updated figures from dynamic queries immediately.",
    desc: "Retrieve changed values from dynamic statements.",
  },
  {
    title: "Executing Dynamic DDL Statements",
    sql: "BEGIN\n  EXECUTE IMMEDIATE 'CREATE TABLE temp_log (log_msg VARCHAR2(100))';\nEND;",
    use: "Builds temporary tables during batch schedules.",
    desc: "Run DDL commands dynamically inside procedures.",
  },
  {
    title: "REF CURSORS for multi-row queries",
    sql: "DECLARE\n  TYPE ref_cur IS REF CURSOR; c_emp ref_cur; v_name VARCHAR2(100);\nBEGIN\n  OPEN c_emp FOR 'SELECT first_name FROM employees';\n  FETCH c_emp INTO v_name; CLOSE c_emp;\nEND;",
    use: "Exposes dynamic lists to client applications safely.",
    desc: "Manage multi-row query pointers in dynamic SQL.",
  },
  {
    title: "DBMS_SQL package execution control",
    sql: "DECLARE\n  v_cur NUMBER; v_rows NUMBER;\nBEGIN\n  v_cur := DBMS_SQL.OPEN_CURSOR;\n  DBMS_SQL.CLOSE_CURSOR(v_cur);\nEND;",
    use: "Enables granular parsing and execution graphs on demand.",
    desc: "Control query steps using the DBMS_SQL utility.",
  },
  {
    title: "Injection protection with Bindings",
    sql: "DECLARE\n  v_param VARCHAR2(100) := 'King';\nBEGIN\n  EXECUTE IMMEDIATE 'SELECT COUNT(*) FROM employees WHERE last_name = :name' USING v_param;\nEND;",
    use: "Hardens code gateways against malicious inputs.",
    desc: "Design secure dynamic queries using placeholders.",
  },
  {
    title: "Dynamic PL/SQL block execution",
    sql: "BEGIN\n  EXECUTE IMMEDIATE 'BEGIN DBMS_OUTPUT.PUT_LINE(''Dynamic''); END;';\nEND;",
    use: "Launches specialized script procedures on demand.",
    desc: "Run complete PL/SQL blocks from string inputs.",
  },
  {
    title: "Recompiling packages programmatically",
    sql: "BEGIN\n  EXECUTE IMMEDIATE 'ALTER PACKAGE emp_pkg COMPILE';\nEND;",
    use: "Cleans broken dependencies after database schema updates.",
    desc: "Trigger package recompilation dynamically.",
  },
  {
    title: "Checking status in USER_OBJECTS",
    sql: "DECLARE\n  v_status VARCHAR2(30);\nBEGIN\n  SELECT status INTO v_status FROM user_objects WHERE object_name = 'EMP_PKG';\nEND;",
    use: "Alerts administrator teams when vital packages break.",
    desc: "Inquire system catalog states for compilations.",
  },
  {
    title: "BULK COLLECT dynamic array fetches",
    sql: "DECLARE\n  TYPE t_names IS TABLE OF VARCHAR2(100); v_names t_names;\nBEGIN\n  SELECT first_name BULK COLLECT INTO v_names FROM employees;\nEND;",
    use: "Speeds up row processing times up to 10x.",
    desc: "Load dataset queries into memory collections in bulk.",
  },
  {
    title: "Bulk collect boundary LIMIT clauses",
    sql: "DECLARE\n  CURSOR c_emp IS SELECT first_name FROM employees;\n  TYPE t_names IS TABLE OF VARCHAR2(100); v_names t_names;\nBEGIN\n  OPEN c_emp; FETCH c_emp BULK COLLECT INTO v_names LIMIT 10; CLOSE c_emp;\nEND;",
    use: "Controls server RAM usage during large exports.",
    desc: "Limit bulk collection chunk sizes.",
  },
  {
    title: "Speeding updates with FORALL",
    sql: "DECLARE\n  TYPE t_ids IS TABLE OF NUMBER; v_ids t_ids := t_ids(100, 101);\nBEGIN\n  FORALL i IN 1..v_ids.COUNT\n    UPDATE employees SET salary = salary * 1.05 WHERE employee_id = v_ids(i);\nEND;",
    use: "Submits batches to the database engine in single context switches.",
    desc: "Execute bulk updates concurrently using FORALL.",
  },
  {
    title: "Bulk FORALL Updates with row lists",
    sql: "DECLARE\n  TYPE t_emp IS TABLE OF employees%ROWTYPE; v_list t_emp;\nBEGIN\n  NULL;\nEND;",
    use: "Applies massive modifications to records concurrently.",
    desc: "Update entire records inside FORALL loops.",
  },
  {
    title: "FORALL bulk deletes and cleans",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Clears massive temporary logs without server lag.",
    desc: "Delete sets of rows concurrently using bulk operations.",
  },
  {
    title: "Error tracking with SAVE EXCEPTIONS",
    sql: "DECLARE\n  TYPE t_ids IS TABLE OF NUMBER; v_ids t_ids := t_ids(99, 100);\nBEGIN\n  FORALL i IN 1..v_ids.COUNT SAVE EXCEPTIONS\n    UPDATE employees SET salary = 9999 WHERE employee_id = v_ids(i);\nEND;",
    use: "Allows batches to finish even if isolated rows fail.",
    desc: "Save bulk collection failures without halting loop.",
  },
  {
    title: "BULK COLLECT combined with RETURNING",
    sql: "DECLARE\n  TYPE t_sal IS TABLE OF NUMBER; v_sals t_sal;\nBEGIN\n  UPDATE employees SET salary = salary * 1.05 BULK COLLECT INTO v_sals;\nEND;",
    use: "Tracks payroll budgets inside processes concurrently.",
    desc: "Fetch updated outputs from bulk calculations.",
  },
  {
    title: "CPU Profiling with DBMS_PROFILER",
    sql: "BEGIN\n  DBMS_PROFILER.START_PROFILER('Run');\n  DBMS_PROFILER.STOP_PROFILER;\nEND;",
    use: "Spots and targets sluggish code statements.",
    desc: "Measure PL/SQL processing times.",
  },
  {
    title: "Memory usage profiling",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Finds memory leaks in long-running schedules.",
    desc: "Track collection size memory inside sessions.",
  },
  {
    title: "Query Plans: EXPLAIN PLAN",
    sql: "EXPLAIN PLAN FOR SELECT * FROM employees;",
    use: "Audits query plans to determine if indexes are used.",
    desc: "Generate database query execution graphs.",
  },
  {
    title: "Unified Compound Trigger boundaries",
    sql: "CREATE TRIGGER trg_compound FOR UPDATE OF salary ON employees COMPOUND TRIGGER\n  BEFORE STATEMENT IS BEGIN NULL; END BEFORE STATEMENT;\n  BEFORE EACH ROW IS BEGIN NULL; END BEFORE EACH ROW;\nEND trg_compound;",
    use: "Maintains shared arrays across triggers without losing state.",
    desc: "Declare unified triggers spanning multiple events.",
  },
  {
    title: "INSTEAD OF triggers for complex Views",
    sql: "CREATE TRIGGER trg_instead_of INSTEAD OF INSERT ON departments FOR EACH ROW\nBEGIN\n  NULL;\nEND;",
    use: "Allows updates to joined view structures cleanly.",
    desc: "Direct insert events on views to table relations.",
  },
  {
    title: "AFTER STARTUP database event triggers",
    sql: "CREATE TRIGGER trg_startup AFTER STARTUP ON DATABASE\nBEGIN\n  NULL;\nEND;",
    use: "Pre-loads common database caches during boot.",
    desc: "Trigger actions when databases start.",
  },
  {
    title: "DDL Event triggers on CREATE/ALTER",
    sql: "CREATE TRIGGER trg_ddl BEFORE DDL ON SCHEMA\nBEGIN\n  NULL;\nEND;",
    use: "Enforces strict database change compliance automatically.",
    desc: "Intercept structural table creation and modification events.",
  },
  {
    title: "Tracking audit history logs",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Maintains clear historical tracking on critical table updates.",
    desc: "Save historical change details using trigger procedures.",
  },
  {
    title: "Mutating Table error solutions",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Resolves Oracle trigger locks during cascading reads.",
    desc: "Avoid mutating errors using compound arrays.",
  },
  {
    title: "Controlling Trigger Order with FOLLOWS",
    sql: "CREATE TRIGGER trg_after_auth AFTER LOGON ON SCHEMA FOLLOWS trg_pre_auth\nBEGIN\n  NULL;\nEND;",
    use: "Guarantees safety logs compile before main code run.",
    desc: "Order triggers sequentially.",
  },
  {
    title: "Trigger filters using WHEN clause",
    sql: "CREATE TRIGGER trg_sal_alert BEFORE UPDATE OF salary ON employees FOR EACH ROW\nWHEN (NEW.salary > 20000)\nBEGIN\n  NULL;\nEND;",
    use: "Filters out minor updates to avoid log bloat.",
    desc: "Limit trigger fires using conditional filters.",
  },
  {
    title: "Autonomous Trigger transactions",
    sql: "CREATE TRIGGER trg_autonomous AFTER INSERT ON employees FOR EACH ROW\nDECLARE\n  PRAGMA AUTONOMOUS_TRANSACTION;\nBEGIN\n  INSERT INTO audit_log VALUES ('Added'); COMMIT;\nEND;",
    use: "Records attempt logs even if main transactions roll back.",
    desc: "Run independent transactions inside triggers.",
  },
  {
    title: "Programmatic Trigger State adjustments",
    sql: "ALTER TRIGGER trg_autonomous DISABLE;",
    use: "Pauses triggers during heavy data warehouse imports.",
    desc: "Enable and disable triggers programmatically.",
  },
  {
    title: "Character Large Objects: CLOBs",
    sql: "DECLARE\n  v_clob CLOB := 'Large Text Data ...';\nBEGIN\n  DBMS_OUTPUT.PUT_LINE(DBMS_LOB.GETLENGTH(v_clob));\nEND;",
    use: "Stores unstructured resumes and bios within records.",
    desc: "Declare and inspect Large Character objects.",
  },
  {
    title: "Binary Large Objects: BLOBs",
    sql: "DECLARE\n  v_blob BLOB;\nBEGIN\n  DBMS_LOB.CREATETEMPORARY(v_blob, TRUE);\nEND;",
    use: "Saves raw photos and files within database columns.",
    desc: "Manage temporary binary large object files.",
  },
  {
    title: "BFILE pointers to external storage",
    sql: "DECLARE\n  v_file BFILE := BFILENAME('LOB_DIR', 'resume.pdf');\nBEGIN\n  NULL;\nEND;",
    use: "Streams external server files through database interfaces.",
    desc: "Reference external database system files.",
  },
  {
    title: "Reading LOBs with DBMS_LOB.READ",
    sql: "DECLARE\n  v_clob CLOB := 'Text content'; v_buffer VARCHAR2(32767); v_amount BINARY_INTEGER := 10;\nBEGIN\n  DBMS_LOB.READ(v_clob, v_amount, 1, v_buffer);\nEND;",
    use: "Extracts text chunks for UI dashboards safely.",
    desc: "Read character streams from CLOB columns.",
  },
  {
    title: "Appending with DBMS_LOB.WRITEAPPEND",
    sql: "DECLARE\n  v_clob CLOB := 'Text ';\nBEGIN\n  DBMS_LOB.WRITEAPPEND(v_clob, 4, 'Data');\nEND;",
    use: "Appends historical log lines to existing documents.",
    desc: "Append text dynamically to CLOB variables.",
  },
  {
    title: "Releasing Temporary LOB arrays",
    sql: "DECLARE\n  v_lob CLOB;\nBEGIN\n  DBMS_LOB.CREATETEMPORARY(v_lob, TRUE);\n  DBMS_LOB.FREETEMPORARY(v_lob);\nEND;",
    use: "Ensures large document uploads don't leak RAM.",
    desc: "Manage temporary LOB lifecycle steps.",
  },
  {
    title: "Converting BLOB to CLOB",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Converts binary text logs to readable characters.",
    desc: "Transform binary fields to character streams.",
  },
  {
    title: "Truncating objects with DBMS_LOB.TRIM",
    sql: "DECLARE\n  v_clob CLOB := 'Data String';\nBEGIN\n  DBMS_LOB.TRIM(v_clob, 4);\nEND;",
    use: "Cleans up trailing spaces on documents.",
    desc: "Shorten LOB values programmatically.",
  },
  {
    title: "PDF content indexers in LOB columns",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Performs full-text searches inside attached resumes.",
    desc: "Extract text elements from binary documents.",
  },
  {
    title: "SecureFile LOB configuration",
    sql: "BEGIN\n  NULL;\nEND;",
    use: "Applies compression and encryption to stored file tables.",
    desc: "Set up fast SecureFile LOB parameters.",
  },
  {
    title: "PRAGMA AUTONOMOUS_TRANSACTION",
    sql: "DECLARE\n  PRAGMA AUTONOMOUS_TRANSACTION;\nBEGIN\n  INSERT INTO log_table VALUES ('Logging event'); COMMIT;\nEND;",
    use: "Persists tracking details even when parent blocks roll back.",
    desc: "Execute isolated transactional logic.",
  },
  {
    title: "Result Cache row caching policies",
    sql: "CREATE FUNCTION get_dept_count (p_id NUMBER) RETURN NUMBER RESULT_CACHE RELIES_ON (employees) IS\n  v_count NUMBER;\nBEGIN\n  SELECT COUNT(*) INTO v_count FROM employees WHERE department_id = p_id; RETURN v_count;\nEND;",
    use: "Drastically speeds up repeated lookups of static tables.",
    desc: "Cache function return values programmatically.",
  },
  {
    title: "Pipelined Table Functions",
    sql: "CREATE FUNCTION get_emp_rows RETURN t_emp_table PIPELINED IS\nBEGIN\n  PIPE ROW(t_emp_rec('John')); RETURN;\nEND;",
    use: "Streams results back to clients without loading full tables in RAM.",
    desc: "Return piped collection records sequentially.",
  },
  {
    title: "Parallel Query Execution Optimizer hints",
    sql: "SELECT /*+ PARALLEL(employees, 4) */ * FROM employees;",
    use: "Leverages multi-core server chips to scan massive datasets faster.",
    desc: "Instruct the optimizer to scan tables in parallel.",
  },
  {
    title: "Virtual Private Database VPD security",
    sql: "BEGIN\n  DBMS_RLS.ADD_POLICY(object_name => 'employees', policy_name => 'emp_policy');\nEND;",
    use: "Applies filters to SQL queries automatically depending on user login roles.",
    desc: "Set up row-level security policy filters.",
  },
  {
    title: "Query Rewrite with Materialized Views",
    sql: "CREATE MATERIALIZED VIEW mv_sal ENABLE QUERY REWRITE AS\nSELECT department_id, SUM(salary) FROM employees GROUP BY department_id;",
    use: "Translates complex queries into fast pre-computed view reads automatically.",
    desc: "Allow automatic rewrites to pre-computed cache tables.",
  },
  {
    title: "Flashback Query timestamps",
    sql: "SELECT * FROM employees AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '1' HOUR);",
    use: "Recovers accidentally deleted records without database backups.",
    desc: "Query tables as they existed in the past.",
  },
  {
    title: "Database Data Pump API backups",
    sql: "DECLARE\n  v_handle NUMBER;\nBEGIN\n  v_handle := DBMS_DATAPUMP.OPEN('EXPORT', 'SCHEMA');\nEND;",
    use: "Exports full schemas automatically using server procedures.",
    desc: "Perform database backups programmatically.",
  },
  {
    title: "Fine-Grained Auditing FGA security",
    sql: "BEGIN\n  DBMS_FGA.ADD_POLICY(object_name => 'employees', policy_name => 'sal_audit');\nEND;",
    use: "Logs specific access to sensitive columns (like salaries).",
    desc: "Audit precise column reading actions.",
  },
  {
    title: "Inter-session alert: DBMS_PIPE",
    sql: "DECLARE\n  v_status NUMBER;\nBEGIN\n  DBMS_PIPE.PACK_MESSAGE('Alert'); v_status := DBMS_PIPE.SEND_MESSAGE('log_pipe');\nEND;",
    use: "Enables fast communication between different background database sessions.",
    desc: "Send messages across database connection blocks.",
  },
];

function buildGeneratedLessons(): Lesson[] {
  const result: Lesson[] = [];

  // 1. Phase 1 generation (Lessons 10 to 52)
  RAW_P1_TOPICS.forEach((topic, idx) => {
    const num = 10 + idx;
    result.push(
      expandLesson({
        num,
        phase: "phase_1",
        level: num <= 15 ? "beginner" : "intermediate",
        title: topic.title,
        diff: num <= 15 ? "easy" : num <= 35 ? "medium" : "hard",
        type: "SQL Querying",
        sql: topic.sql,
        desc: topic.desc,
        use: topic.use,
        goal: `To master "${topic.title}" using standard Oracle SQL syntax.`,
        ans: topic.sql,
      }),
    );
  });

  // 2. Phase 2 generation (Lessons 53 to 106)
  RAW_P2_TOPICS.forEach((topic, idx) => {
    const num = 53 + idx;
    result.push(
      expandLesson({
        num,
        phase: "phase_2",
        level: num <= 80 ? "intermediate" : "advanced",
        title: topic.title,
        diff: num <= 70 ? "easy" : num <= 90 ? "medium" : "hard",
        type: "PL/SQL block",
        sql: topic.sql,
        desc: topic.desc,
        use: topic.use,
        goal: `To master PL/SQL "${topic.title}" block coding paradigms.`,
        ans: topic.sql,
      }),
    );
  });

  // 3. Phase 3 generation (Lessons 107 to 158)
  RAW_P3_TOPICS.forEach((topic, idx) => {
    const num = 107 + idx;
    result.push(
      expandLesson({
        num,
        phase: "phase_3",
        level: num <= 130 ? "advanced" : "expert",
        title: topic.title,
        diff: num <= 125 ? "medium" : "hard",
        type: "Advanced DB",
        sql: topic.sql,
        desc: topic.desc,
        use: topic.use,
        goal: `To master advanced database technique: "${topic.title}".`,
        ans: topic.sql,
      }),
    );
  });

  return result;
}

interface RawLessonDef {
  num: number;
  phase: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  title: string;
  diff: "easy" | "medium" | "hard";
  type: string;
  sql: string;
  desc: string;
  use: string;
  goal: string;
  ans: string;
}

// generated lessons read the same way the handwritten ones do.
const KEYWORD_LIBRARY: Record<
  string,
  {
    meaning: string;
    why_we_use_it: string;
    easy_example: string;
    common_mistake: string;
    priority: number;
  }
> = {
  "GROUP BY": {
    meaning:
      "Partitions query rows into distinct logical groups based on matching values in one or more columns, enabling aggregate functions (like SUM, AVG, COUNT) to compute summary statistics per group.",
    why_we_use_it:
      "It consolidates hundreds of transactional detail rows into a highly informative per-category summary (e.g., finding the 'average salary within each department' instead of viewing individual employees).",
    easy_example:
      "GROUP BY department_id aggregates individual employees into single rows representing each unique department.",
    common_mistake:
      "Selecting a raw, non-aggregated column that is omitted from the GROUP BY clause. Relational engines strictly prohibit this to avoid ambiguous column mapping.",
    priority: 8,
  },
  HAVING: {
    meaning:
      "Applies a conditional filter specifically to consolidated groups and aggregated metrics, executing logically after the GROUP BY phase is completed.",
    why_we_use_it:
      "It lets you filter on aggregate criteria (e.g., 'only departments with an average salary over $8,000') which cannot be checked in a WHERE clause because individual rows have not been grouped yet.",
    easy_example:
      "HAVING AVG(salary) > 8000 retains only grouped departments that satisfy this average criteria.",
    common_mistake:
      "Placing aggregate conditions (like AVG or SUM) inside the WHERE clause. Always use HAVING for group-level filtering.",
    priority: 7,
  },
  "ORDER BY": {
    meaning:
      "Establishes a predictable, sorted sequence for your query's final output rows based on specified column values.",
    why_we_use_it:
      "Relational database tables are technically unordered sets. Without ORDER BY, the returned row order is never guaranteed, making explicit sorting essential for presentation.",
    easy_example:
      "ORDER BY hire_date DESC displays the most recently hired employees first.",
    common_mistake:
      "Assuming ORDER BY runs before filtering or grouping. It always runs last in the logical query processing order, after all filtering and aggregation are complete.",
    priority: 3,
  },
  JOIN: {
    meaning:
      "Combines related rows from two or more distinct tables by evaluating a shared key column defined in an ON condition.",
    why_we_use_it:
      "To maintain normalized databases (avoiding redundant data duplicate entries), records are separated into distinct tables. JOINs seamlessly reconstruct these relationships.",
    easy_example:
      "JOIN departments ON employees.department_id = departments.department_id correlates each employee with their specific department details.",
    common_mistake:
      "Omitting the ON relationship clause, which results in an accidental Cartesian Product (CROSS JOIN) that pairs every single row of both tables, causing severe performance issues and incorrect outputs.",
    priority: 9,
  },
  "LEFT JOIN": {
    meaning:
      "Preserves all rows from the primary (left) table, alongside matching rows from the secondary (right) table, filling in NULLs where no match exists.",
    why_we_use_it:
      "It is indispensable when you must retrieve a complete master list without losing records that lack associated relationships (e.g., listing all employees, including those not yet assigned to any department).",
    easy_example:
      "employees LEFT JOIN departments includes employees with a NULL department ID in the output.",
    common_mistake:
      "Applying a restrictive WHERE filter on the right table's columns after a LEFT JOIN, which accidentally converts the outer join back into a strict inner join.",
    priority: 9,
  },
  "CROSS JOIN": {
    meaning:
      "Produces a Cartesian Product, combining every row from the first table with every row from the second table without any filtering condition.",
    why_we_use_it:
      "It is used to generate complete combinatorial matrices, such as matching all possible system permissions against all existing user roles.",
    easy_example:
      "A table of 5 products CROSS JOINed with 3 sizes yields 15 total variations.",
    common_mistake:
      "Using a CROSS JOIN unintentionally due to a missing ON condition in an inner join, leading to enormous, slow, and confusing results.",
    priority: 9,
  },
  "SELF JOIN": {
    meaning:
      "A self-join refers to a table joined with itself, treating it as two distinct logical instances during the query evaluation.",
    why_we_use_it:
      "It resolves hierarchical or recursive relationships stored in a single table, such as linking an employee record to their supervisor's record within the same list.",
    easy_example:
      "employees e JOIN employees m ON e.manager_id = m.employee_id maps workers directly to their managers' details.",
    common_mistake:
      "Failing to assign unique, clear table aliases (like 'e' and 'm') to the two logical instances of the table, causing reference ambiguity errors.",
    priority: 9,
  },
  EXISTS: {
    meaning:
      "A boolean operator that evaluates whether a subquery returns one or more rows, stopping search immediately upon finding the first match.",
    why_we_use_it:
      "It is highly efficient for membership checks because it avoids full table scans, short-circuiting as soon as a single matching record is located.",
    easy_example:
      "WHERE EXISTS (SELECT 1 FROM employees WHERE department_id = d.department_id) checks if a department is active.",
    common_mistake:
      "Writing complex column selections inside the subquery. Since EXISTS only checks for row presence, using SELECT 1 is the cleanest and most standard approach.",
    priority: 6,
  },
  CASE: {
    meaning:
      "Implements conditional, if-then-else logical branching directly inside your SQL projection list or filters.",
    why_we_use_it:
      "It allows you to transform raw, structured database values into user-friendly categories or scores dynamically during query execution.",
    easy_example:
      "CASE WHEN salary > 15000 THEN 'Executive' ELSE 'Staff' END categorizes employees based on pay.",
    common_mistake:
      "Omitting the ELSE fallback statement, which causes any row that fails to match all of your defined conditions to silently return NULL.",
    priority: 5,
  },
  SUBQUERY: {
    meaning:
      "An inner SELECT statement nested inside a parent query, acting as an intermediary step to supply values or lists.",
    why_we_use_it:
      "It lets you perform multi-step calculations dynamically, such as filtering rows based on a calculation (like average salary) that must be computed first.",
    easy_example:
      "WHERE salary > (SELECT AVG(salary) FROM employees) compares each employee's salary against the company average.",
    common_mistake:
      "Failing to verify whether your subquery returns a single value (scalar) or multiple values when using single-value comparison operators (like '=' or '>'). Use 'IN' for multi-value results.",
    priority: 6,
  },
  DECLARE: {
    meaning:
      "Initiates the declarative section of a PL/SQL block, where local variables, custom types, and cursors are allocated.",
    why_we_use_it:
      "It establishes the structured memory space that your subsequent executable code will read from or write to during runtime.",
    easy_example:
      "DECLARE v_max_salary NUMBER; reserves a typed space in memory to store a maximum salary limit.",
    common_mistake:
      "Attempting to assign values to variables inside the BEGIN block that were not previously defined in the DECLARE section.",
    priority: 7,
  },
  BEGIN: {
    meaning:
      "Establishes the boundary of the executable command block where your procedural instructions and SQL actions are run.",
    why_we_use_it:
      "It clearly demarcates configuration and declarations from the active, procedural engine execution flow.",
    easy_example:
      "The BEGIN block holds all conditional branches, loops, and transactional statements.",
    common_mistake:
      "Forgetting the mandatory matching 'END;' instruction, which results in a parse error during block compilation.",
    priority: 4,
  },
  EXCEPTION: {
    meaning:
      "Opens a dedicated error-trapping scope that intercepts and handles any runtime anomalies raised in the BEGIN block.",
    why_we_use_it:
      "It prevents unexpected failures or database issues from crashing the application, allowing you to log details or roll back gracefully.",
    easy_example:
      "EXCEPTION WHEN NO_DATA_FOUND THEN log_error(); handles queries that return no rows.",
    common_mistake:
      "Using an empty 'WHEN OTHERS THEN NULL;' statement, which silences all errors and makes debugging or resolving critical bugs impossible.",
    priority: 8,
  },
  CURSOR: {
    meaning:
      "A controlled, named pointer to a private SQL memory area containing the active result set of a multi-row query.",
    why_we_use_it:
      "It allows procedural PL/SQL blocks to process query results systematically, row-by-row, rather than trying to handle entire datasets in a single step.",
    easy_example:
      "CURSOR emp_cur IS SELECT * FROM employees; opens up individual row processing.",
    common_mistake:
      "Opening a manual cursor and failing to close it, which locks up active database resources and session cursors.",
    priority: 8,
  },
  LOOP: {
    meaning:
      "Establishes an unconstrained, iterative instruction cycle that continues executing until forced to terminate.",
    why_we_use_it:
      "It is the most flexible looping structure, giving you absolute control over when and how the iteration exits based on complex runtime metrics.",
    easy_example:
      "LOOP fetch_data(); EXIT WHEN cursor%NOTFOUND; END LOOP; cycles until no more data exists.",
    common_mistake:
      "Neglecting to include a robust, reachable EXIT condition, which creates an infinite loop that can lock database resources.",
    priority: 5,
  },
  FOR: {
    meaning:
      "Automates iterative cycles over a specific, predictable range of values or over the rows of an active cursor.",
    why_we_use_it:
      "It minimizes boilerplate code by automatically declaring the index variable, handling loop increments, and closing cursor assets.",
    easy_example:
      "FOR i IN 1..10 LOOP processes a sequence of actions exactly ten times.",
    common_mistake:
      "Attempting to manually modify or assign new values to the loop index variable inside the loop body, which is strictly prohibited.",
    priority: 5,
  },
  WHILE: {
    meaning:
      "Evaluates a conditional check before each iteration, executing its instructions only as long as that check remains true.",
    why_we_use_it:
      "It is perfect for conditional processes where the exact number of required loops is unknown and depends entirely on changing variables.",
    easy_example:
      "WHILE v_balance > 0 LOOP process_payment(); END LOOP; runs as long as the balance remains positive.",
    common_mistake:
      "Forgetting to update the conditional check variable inside the loop body, resulting in an endless loop.",
    priority: 5,
  },
  IF: {
    meaning:
      "A fundamental decision-making construct that executes specific procedural branches depending on a boolean evaluation.",
    why_we_use_it:
      "It allows your database code to behave dynamically, taking different actions based on variable values or column data.",
    easy_example:
      "IF v_salary > 20000 THEN apply_tax(); END IF; executes tax logic only for high-earning rows.",
    common_mistake:
      "Forgetting the terminating 'END IF;' statement, which will fail to compile.",
    priority: 4,
  },
  "EXECUTE IMMEDIATE": {
    meaning:
      "Parses and executes a dynamic SQL statement or PL/SQL block represented as a text string at runtime.",
    why_we_use_it:
      "It lets you run administrative commands (like DDL) or construct highly dynamic queries whose table names or structures are unknown until execution.",
    easy_example:
      "EXECUTE IMMEDIATE 'ALTER TABLE employees ADD status VARCHAR2(10)';",
    common_mistake:
      "Concatenating variables directly into the query string rather than using bind variables (USING clause), which exposes the database to SQL injection.",
    priority: 8,
  },
  "BULK COLLECT": {
    meaning:
      "Fetches query results in high-speed batches directly into PL/SQL collections instead of processing row-by-row.",
    why_we_use_it:
      "It eliminates the performance overhead of 'context switching' between the PL/SQL procedural engine and the SQL database engine, boosting speed.",
    easy_example:
      "SELECT * BULK COLLECT INTO v_emp_cache FROM employees; loads records into memory in one step.",
    common_mistake:
      "Loading massive datasets with millions of rows directly into collections without a LIMIT clause, which can exhaust server memory.",
    priority: 8,
  },
  FORALL: {
    meaning:
      "A bulk statement driver that sends multiple DML (Insert, Update, Delete) updates to the SQL engine as a single, combined batch.",
    why_we_use_it:
      "It offers a massive performance boost for write operations, converting thousands of separate database trips into one fast bulk transaction.",
    easy_example:
      "FORALL i IN 1..v_ids.COUNT UPDATE employees SET status = 'Active' WHERE id = v_ids(i);",
    common_mistake:
      "Treating FORALL as a normal loop. It cannot contain multiple procedural statements; it must drive a single, bulk-compatible DML action.",
    priority: 8,
  },
  TRIGGER: {
    meaning:
      "An automated, event-driven PL/SQL block that executes immediately before or after specific actions (such as INSERT, UPDATE, or DELETE) occur on a table.",
    why_we_use_it:
      "It guarantees strict compliance, data validation, and audit tracking across all transactions, regardless of which application made the change.",
    easy_example:
      "A trigger that automatically records the user ID and timestamp whenever an employee's salary is changed.",
    common_mistake:
      "Including heavy business calculations or slow network calls inside a row-level trigger, which can severely slow down normal database writes.",
    priority: 8,
  },
  PROCEDURE: {
    meaning:
      "A pre-compiled, named block of PL/SQL code saved in the database database that performs complex operations.",
    why_we_use_it:
      "It centralizes repetitive business processes on the database server, reducing network traffic and ensuring consistent rule enforcement.",
    easy_example:
      "CREATE PROCEDURE hire_employee(name VARCHAR2, sal NUMBER) IS ... defines a reusable hiring block.",
    common_mistake:
      "Duplicating similar code routines across several procedures instead of abstracting shared operations into a single modular routine.",
    priority: 7,
  },
  FUNCTION: {
    meaning:
      "A pre-compiled PL/SQL routine that is designed to perform a calculation and MUST return a single value to the caller.",
    why_we_use_it:
      "Because it returns a value, you can embed custom functions directly inside your standard SQL statements (just like SUM or UPPER).",
    easy_example:
      "SELECT get_annual_tax(salary) FROM employees; computes tax dynamically for each projected row.",
    common_mistake:
      "Failing to provide a RETURN statement in every single logical path of the function, which causes a compile-time or runtime crash.",
    priority: 7,
  },
  PACKAGE: {
    meaning:
      "A modular container that groups related procedures, functions, variables, and custom types together under a single namespace.",
    why_we_use_it:
      "It provides clean encapsulation, separating the public interface (Specification) from the private code logic (Body), which improves security and code maintenance.",
    easy_example:
      "employee_mgmt_pkg.terminate_employee(...) calls a modular procedure nested within the management package.",
    common_mistake:
      "Exposing private utility variables or inner helper functions in the Package Specification that should remain hidden in the Package Body.",
    priority: 6,
  },
  RANK: {
    meaning:
      "RANK() is an analytical window function that assigns a unique rank to each row based on a sort order, leaving numerical gaps if there is a tie.",
    why_we_use_it:
      "It is perfect for official competition tables (e.g., if two salespeople are tied for 1st place, they both get rank 1, and the next salesperson is ranked 3rd).",
    easy_example:
      "RANK() OVER (ORDER BY sales_volume DESC) ranks sellers with gaps after ties.",
    common_mistake:
      "Using RANK() when you actually want a continuous sequence without gaps (e.g., 1st, 2nd, 3rd, 4th) when ties exist. Use DENSE_RANK() for continuous sequences.",
    priority: 7,
  },
  "PARTITION BY": {
    meaning:
      "Divides your dataset into logical segments or 'partitions' for an analytical window function to operate on independently.",
    why_we_use_it:
      "It allows you to compute localized running subtotals or ranks within distinct categories (e.g., finding the top earners within each department separately) without flattening your query's rows.",
    easy_example:
      "AVG(salary) OVER (PARTITION BY department_id) displays each employee's salary side-by-side with their department's average.",
    common_mistake:
      "Confusing PARTITION BY with GROUP BY. PARTITION BY does not consolidate or collapse your result rows; it keeps every original record visible.",
    priority: 7,
  },
  ROLLUP: {
    meaning:
      "An extension of the GROUP BY clause that automatically computes multiple hierarchical levels of subtotal rows, culminating in a grand total.",
    why_we_use_it:
      "It lets you generate structured summary reports featuring detailed categories, departmental subtotals, and corporate grand totals within a single, highly efficient query.",
    easy_example:
      "GROUP BY ROLLUP(department_id, job_id) aggregates detailed rows and outputs subtotals per department and a final total.",
    common_mistake:
      "Expecting ROLLUP to automatically format the output report. You must use functions like GROUPING() to replace NULLs with friendly labels like 'Grand Total'.",
    priority: 6,
  },
  "PRAGMA AUTONOMOUS_TRANSACTION": {
    meaning:
      "This compiler directive (pragma) allows a PL/SQL block to execute and finalize (COMMIT or ROLLBACK) transactions independently of the calling program's transaction.",
    why_we_use_it:
      "It is indispensable for system logging. It ensures that audit trails or error logs are committed permanently to the database even if the parent business transaction is aborted and rolled back.",
    easy_example:
      "An error-logging procedure commits its log entry safely without committing the partial employee update that caused the error.",
    common_mistake:
      "Using autonomous transactions for standard, interdependent business actions. This bypasses normal ACID transaction security rules and can leave orphaned data.",
    priority: 6,
  },
  DBMS_LOB: {
    meaning:
      "Specialized system package designed to interact with and manage large, unstructured data types (CLOBs and BLOBs) exceeding normal database column limits.",
    why_we_use_it:
      "Standard VARCHAR2 data types are restricted to 4,000 bytes. DBMS_LOB provides specialized, fast tools to stream, write, and search through full files, resumes, and images.",
    easy_example:
      "DBMS_LOB.GETLENGTH(my_clob) calculates the exact size of a large, stored character document.",
    common_mistake:
      "Failing to release temporary LOB handles using DBMS_LOB.FREETEMPORARY(), which gradually leaks database memory.",
    priority: 5,
  },
};

// A short list of (keyword, extra rule) pairs used to build
// important_rules / things_to_remember / common_beginner_mistakes
// without repeating the exact same three bullet points on every lesson.
const RULE_LIBRARY: Record<
  string,
  { rule: string; remember: string; mistake: string }
> = {
  "GROUP BY": {
    rule: "Every non-aggregated column in SELECT must also appear in GROUP BY.",
    remember: "GROUP BY runs after WHERE but before HAVING and ORDER BY.",
    mistake: "Selecting a raw column that isn't grouped or aggregated.",
  },
  HAVING: {
    rule: "HAVING can only be used meaningfully alongside GROUP BY.",
    remember:
      "WHERE filters rows first; HAVING filters the resulting groups afterward.",
    mistake: "Trying to filter on an aggregate using WHERE instead of HAVING.",
  },
  JOIN: {
    rule: "A JOIN always needs an ON condition describing how the two tables relate.",
    remember:
      "The table alias you choose determines how you reference each table's columns afterward.",
    mistake:
      "Omitting the ON clause and accidentally producing a full cross join.",
  },
  CURSOR: {
    rule: "Every OPENed cursor should eventually be CLOSEd to free resources.",
    remember:
      "A cursor FOR loop handles OPEN/FETCH/CLOSE automatically for you.",
    mistake: "Leaving a manually opened cursor open after the block finishes.",
  },
  EXCEPTION: {
    rule: "Exception handlers should be specific where possible instead of always using WHEN OTHERS.",
    remember:
      "Once an exception is raised, the rest of the BEGIN block is skipped and control jumps straight to EXCEPTION.",
    mistake: "Swallowing errors silently with an empty WHEN OTHERS handler.",
  },
  TRIGGER: {
    rule: "Keep trigger logic lightweight, since it runs on every matching row automatically.",
    remember:
      "Triggers fire based on the database event itself, regardless of which tool or user caused it.",
    mistake:
      "Writing slow, heavy logic inside a row-level trigger that fires on every single row.",
  },
  "BULK COLLECT": {
    rule: "Use a LIMIT clause with BULK COLLECT on very large tables to avoid excessive memory use.",
    remember:
      "BULK COLLECT trades a little memory for a large reduction in context switches.",
    mistake: "Bulk collecting an entire massive table with no LIMIT at all.",
  },
  FORALL: {
    rule: "Add SAVE EXCEPTIONS if you want the batch to continue even when one row fails.",
    remember:
      "FORALL sends the whole batch of DML statements to SQL in a single round trip.",
    mistake:
      "Assuming FORALL behaves exactly like a normal FOR loop over individual statements.",
  },
  "EXECUTE IMMEDIATE": {
    rule: "Always use USING bind variables for any value coming from outside the block.",
    remember:
      "Dynamic SQL is required whenever the statement's structure isn't known until runtime.",
    mistake:
      "Concatenating raw values directly into the SQL string instead of binding them.",
  },
  PROCEDURE: {
    rule: "A procedure does not return a value directly - use OUT parameters if a caller needs data back.",
    remember:
      "Procedures centralize logic so every caller behaves consistently.",
    mistake:
      "Duplicating logic in multiple places instead of calling one shared procedure.",
  },
  FUNCTION: {
    rule: "Every code path inside a function must return a value of the declared RETURN type.",
    remember:
      "Functions can be called directly inside SQL statements, unlike procedures.",
    mistake: "Leaving a branch of logic without a RETURN statement.",
  },
};

const GENERIC_KEYWORD_INFO = {
  meaning:
    "This statement instructs the Oracle engine to perform a specific structural or procedural operation as part of the overall block.",
  why_we_use_it:
    "It is the standard building block Oracle requires to express this kind of logic clearly and unambiguously.",
  easy_example:
    "Think of it as one instruction in a short recipe - each line tells the engine exactly what to do next.",
  common_mistake:
    "Misspelling the keyword or leaving out a required companion keyword it depends on.",
};

function detectKeywords(sql: string): string[] {
  const upper = sql.toUpperCase();
  const found: { key: string; priority: number }[] = [];

  Object.keys(KEYWORD_LIBRARY).forEach((key) => {
    if (upper.includes(key)) {
      found.push({ key, priority: KEYWORD_LIBRARY[key].priority });
    }
  });

  // A plain "JOIN" already covers LEFT JOIN/CROSS JOIN/self join text,
  // so prefer the more specific variant when both match.
  const hasSpecificJoin = found.some((f) =>
    ["LEFT JOIN", "CROSS JOIN", "SELF JOIN"].includes(f.key),
  );
  const filtered = hasSpecificJoin
    ? found.filter((f) => f.key !== "JOIN")
    : found;

  return filtered.sort((a, b) => b.priority - a.priority).map((f) => f.key);
}

function buildKeywordBreakdown(sql: string, title: string) {
  const matched = detectKeywords(sql).slice(0, 3);

  if (matched.length === 0) {
    return [
      {
        keyword: title,
        ...GENERIC_KEYWORD_INFO,
      },
    ];
  }

  return matched.map((key) => ({
    keyword: key,
    meaning: KEYWORD_LIBRARY[key].meaning,
    why_we_use_it: KEYWORD_LIBRARY[key].why_we_use_it,
    easy_example: KEYWORD_LIBRARY[key].easy_example,
    common_mistake: KEYWORD_LIBRARY[key].common_mistake,
  }));
}

function buildLineByLineExplanation(sql: string, isPlSql: boolean): string[] {
  const lines = sql
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return lines.map((line) => {
    const upper = line.toUpperCase();
    if (upper.startsWith("SELECT")) {
      return `${line} -> Instructs the engine to retrieve and project these specific columns, computed values, or aggregates from the source relations.`;
    }
    if (upper.startsWith("FROM")) {
      return `${line} -> Identifies the primary database table or view that acts as the starting dataset for the query execution pipeline.`;
    }
    if (upper.startsWith("WHERE")) {
      return `${line} -> Evaluates this condition row-by-row, discarding any records that do not satisfy the criteria before any grouping or sorting occurs.`;
    }
    if (upper.startsWith("GROUP BY")) {
      return `${line} -> Consolidates rows sharing identical values in these columns into singular, unified buckets so aggregate functions can compute summaries for each bucket.`;
    }
    if (upper.startsWith("HAVING")) {
      return `${line} -> Evaluates aggregate metrics row-group by row-group, retaining only the summary buckets that meet this post-aggregation conditional check.`;
    }
    if (upper.startsWith("ORDER BY")) {
      return `${line} -> Dictates the sorting algorithm's final output order, arranging the resulting dataset in either ascending or descending sequence.`;
    }
    if (
      upper.startsWith("JOIN") ||
      upper.includes(" JOIN ") ||
      upper.startsWith("LEFT JOIN") ||
      upper.startsWith("CROSS JOIN")
    ) {
      return `${line} -> Correlates and links matching records from an adjacent table based on the logical keys specified in the ON condition.`;
    }
    if (upper.startsWith("DECLARE")) {
      return `${line} -> Initiates the declarative scope of the block, defining and allocating memory structures for local variables, types, and cursors.`;
    }
    if (upper.startsWith("BEGIN")) {
      return `${line} -> Demarcates the start of the executable instruction sequence where procedural logic and SQL commands are sequentially run.`;
    }
    if (upper.startsWith("EXCEPTION")) {
      return `${line} -> Establishes a dedicated runtime safety block to trap, handle, log, or recover from any transactional errors raised inside the BEGIN scope.`;
    }
    if (upper.startsWith("END")) {
      return `${line} -> Formally closes the active program block, compound control sequence, conditional IF branch, or loop structure.`;
    }
    if (
      upper.startsWith("IF") ||
      upper.startsWith("ELSIF") ||
      upper.startsWith("ELSE")
    ) {
      return `${line} -> Introduces a procedural decision branch, evaluating a conditional check to run specific actions depending on a true/false assessment.`;
    }
    if (upper.startsWith("LOOP")) {
      return `${line} -> Starts a continuous, iterative cycle, executing the nested database instructions repeatedly until forced to stop by an EXIT condition.`;
    }
    if (upper.startsWith("FOR ") || upper.startsWith("FORALL")) {
      return `${line} -> Iterates efficiently through a fixed range of indices, bulk collections, or active cursor rows to process elements systematically.`;
    }
    if (upper.startsWith("WHILE")) {
      return `${line} -> Iterates continuously through a sequence of instructions as long as the initial conditional expression evaluates to true.`;
    }
    if (
      upper.startsWith("CREATE") ||
      upper.startsWith("ALTER") ||
      upper.startsWith("DROP")
    ) {
      return `${line} -> Directs the database server to issue a Data Definition Language (DDL) request to permanently create, alter, or drop a database object.`;
    }
    if (upper.startsWith("EXECUTE IMMEDIATE")) {
      return `${line} -> Compiles and executes an ad-hoc SQL or PL/SQL statement represented as a dynamic text string during runtime.`;
    }
    if (upper.startsWith("INSERT INTO")) {
      return `${line} -> Inserts a new row with the specified values into the target database table.`;
    }
    if (upper.startsWith("UPDATE")) {
      return `${line} -> Performs a Data Manipulation Language (DML) modification, altering existing column values for rows that match the update filters.`;
    }
    if (upper.startsWith("DELETE FROM")) {
      return `${line} -> Removes matching rows permanently from the target database table.`;
    }
    if (upper.startsWith("COMMIT") || upper.startsWith("ROLLBACK")) {
      return `${line} -> Concludes the current transaction, either committing all changes permanently to disk or rolling them back to restore consistency.`;
    }
    if (upper.startsWith("PRAGMA")) {
      return `${line} -> Advises the PL/SQL compiler with specific compilation rules (such as establishing a separate autonomous transaction context).`;
    }
    if (upper.startsWith("DBMS_LOB")) {
      return `${line} -> Interacts with large object storage channels using Oracle's native high-performance DBMS_LOB system package.`;
    }
    return `${line} -> ${isPlSql ? "Executes the next procedural database action within this transactional instruction thread." : "Adds detailed context or projection filters to construct the final query result."}`;
  });
}

function buildExecutionFlow(
  sql: string,
  isPlSql: boolean,
  use: string,
): string[] {
  const matched = detectKeywords(sql);

  if (isPlSql) {
    const steps = [
      "Oracle compiles the PL/SQL block, checking every declared variable and referenced object exists.",
    ];
    if (matched.includes("DECLARE"))
      steps.push(
        "It allocates memory for each declared variable, cursor, or type in the DECLARE section.",
      );
    if (matched.includes("CURSOR"))
      steps.push(
        "Any cursor is opened and rows are fetched one at a time as the loop runs.",
      );
    steps.push(
      "It executes the BEGIN section's statements in order, top to bottom.",
    );
    if (matched.includes("EXCEPTION"))
      steps.push(
        "If any statement raises an error, control jumps immediately to the matching EXCEPTION handler.",
      );
    steps.push(
      `In practice, this pattern is what supports real workflows like: ${use}`,
    );
    return steps;
  }

  const steps = [
    "Oracle first resolves the FROM clause to know which table(s) are involved.",
  ];
  if (
    matched.includes("JOIN") ||
    matched.includes("LEFT JOIN") ||
    matched.includes("CROSS JOIN") ||
    matched.includes("SELF JOIN")
  ) {
    steps.push(
      "It matches rows across the joined tables using the ON condition before anything else happens.",
    );
  }
  steps.push(
    "It then applies the WHERE condition (if any), discarding rows that don't qualify.",
  );
  if (matched.includes("GROUP BY"))
    steps.push(
      "Surviving rows are grouped into buckets based on the GROUP BY column(s).",
    );
  if (matched.includes("HAVING"))
    steps.push(
      "Each group is checked against the HAVING condition, and non-matching groups are dropped entirely.",
    );
  steps.push(
    "Finally, it builds the SELECT list for whatever rows or groups remain.",
  );
  if (matched.includes("ORDER BY"))
    steps.push(
      "The result is sorted according to ORDER BY as the very last step.",
    );
  steps.push(
    `This is the same underlying pattern behind real systems, for example: ${use}`,
  );
  return steps;
}

function buildRulesRememberMistakes(sql: string, isPlSql: boolean) {
  const matched = detectKeywords(sql).filter((k) => RULE_LIBRARY[k]);

  const rules: string[] = matched.map((k) => RULE_LIBRARY[k].rule);
  const remembers: string[] = matched.map((k) => RULE_LIBRARY[k].remember);
  const mistakes: string[] = matched.map((k) => RULE_LIBRARY[k].mistake);

  if (rules.length === 0) {
    rules.push(
      isPlSql
        ? "Every DECLARE section must close with BEGIN, and every BEGIN must close with a matching END;."
        : "Clause order is always fixed: SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY.",
    );
  }
  if (remembers.length === 0) {
    remembers.push(
      isPlSql
        ? "PL/SQL blocks execute top to bottom, statement by statement, unless an exception redirects control."
        : "SQL describes WHAT data you want, not the step-by-step procedure for getting it - the optimizer decides the actual steps.",
    );
  }
  if (mistakes.length === 0) {
    mistakes.push(
      "Missing a semicolon, a closing keyword, or a required comma between items.",
    );
  }

  return {
    important_rules: Array.from(new Set(rules)).slice(0, 4),
    things_to_remember: Array.from(new Set(remembers)).slice(0, 4),
    common_beginner_mistakes: Array.from(new Set(mistakes)).slice(0, 4),
  };
}

function buildVisualDiagram(sql: string, isPlSql: boolean): string {
  const matched = detectKeywords(sql);

  if (isPlSql) {
    let d =
      "DECLARE (set up variables)\n  |\n  v\nBEGIN (run logic top to bottom)";
    if (
      matched.includes("CURSOR") ||
      matched.includes("LOOP") ||
      matched.includes("FOR")
    ) {
      d += "\n  |\n  v\nLOOP / FETCH rows one at a time";
    }
    if (matched.includes("EXCEPTION")) {
      d += "\n  |\n  v\nEXCEPTION (only if an error was raised above)";
    }
    d += "\n  |\n  v\nEND (block finishes)";
    return d;
  }

  let d = "FROM table(s)";
  if (
    matched.includes("JOIN") ||
    matched.includes("LEFT JOIN") ||
    matched.includes("CROSS JOIN") ||
    matched.includes("SELF JOIN")
  ) {
    d += "\n  |\n  v\nJOIN matching rows using ON condition";
  }
  d += "\n  |\n  v\nWHERE filters rows (if present)";
  if (matched.includes("GROUP BY"))
    d += "\n  |\n  v\nGROUP BY buckets rows into groups";
  if (matched.includes("HAVING"))
    d += "\n  |\n  v\nHAVING filters out whole groups";
  d += "\n  |\n  v\nSELECT builds the output columns";
  if (matched.includes("ORDER BY"))
    d += "\n  |\n  v\nORDER BY sorts the final result";
  return d;
}

function buildQuiz(def: RawLessonDef, matched: string[]): Quiz {
  const keywordFact = matched.length > 0 ? KEYWORD_LIBRARY[matched[0]] : null;

  const mcq = [
    {
      question: `What is the main goal of Lesson ${def.num}: "${def.title}"?`,
      options: [
        def.desc,
        "To permanently delete the underlying table structure.",
        "To reset all user passwords across the schema.",
        "To change the database's character set encoding.",
      ],
      correct_answer: def.desc,
      explanation: `This lesson focuses on: ${def.desc}`,
    },
    {
      question:
        "Where would this pattern realistically show up in a production system?",
      options: [
        def.use,
        "In a CSS stylesheet controlling page layout.",
        "In a router's firmware update process.",
        "In a spreadsheet's cell formatting rules.",
      ],
      correct_answer: def.use,
      explanation: def.use,
    },
  ];

  if (keywordFact) {
    mcq.push({
      question: `What does ${matched[0]} actually do?`,
      options: [
        keywordFact.meaning,
        "It permanently renames every column in the table.",
        "It encrypts the entire database on disk.",
        "It restarts the current database session.",
      ],
      correct_answer: keywordFact.meaning,
      explanation: keywordFact.why_we_use_it,
    });
  }

  return {
    mcq,
    true_false: [
      {
        statement:
          "Running this statement, as written, permanently deletes or restructures existing table data.",
        answer: false,
        explanation:
          "This lesson's statement reads or processes data through standard SQL/PL-SQL logic; it does not drop or corrupt existing structures.",
      },
    ],
    predict_output: [
      {
        sql: def.sql,
        correct_output:
          matched.length > 0
            ? `Oracle applies ${matched.join(", ")} in the order described above, then returns the resulting rows or completes the procedural block.`
            : "Oracle compiles and executes the statement, returning the matching rows or completing the block successfully.",
        explanation:
          "Once you can trace each clause or line to what it contributes, predicting the output becomes mechanical rather than guesswork.",
      },
    ],
    find_error: [
      {
        broken_sql: def.sql
          .replace(/SELECT/i, "SELCT")
          .replace(/DECLARE/i, "DECLAR")
          .replace(/BEGIN/i, "BEGN"),
        error: "A required keyword is misspelled, which Oracle cannot parse.",
        fixed_sql: def.sql,
      },
    ],
    write_sql_challenge: [
      {
        prompt: `Write the statement needed to accomplish: "${def.title}".`,
        expected_answer: def.ans,
      },
    ],
  };
}

function mockExecuteSQL(
  sql: string,
  table: TableData,
): { columns: string[]; rows: any[] } {
  const upperSql = sql.toUpperCase();

  if (upperSql.includes("COUNT(")) {
    return { columns: ["ROW_COUNT"], rows: [{ ROW_COUNT: table.rows.length }] };
  }
  if (upperSql.includes("SUM(")) {
    return { columns: ["TOTAL_SUM"], rows: [{ TOTAL_SUM: 45000 }] };
  }
  if (upperSql.includes("AVG(")) {
    return { columns: ["AVERAGE_VAL"], rows: [{ AVERAGE_VAL: 8500 }] };
  }
  if (upperSql.includes("MAX(")) {
    return { columns: ["MAXIMUM_VAL"], rows: [{ MAXIMUM_VAL: 24000 }] };
  }
  if (upperSql.includes("MIN(")) {
    return { columns: ["MINIMUM_VAL"], rows: [{ MINIMUM_VAL: 2100 }] };
  }

  return {
    columns: table.columns.slice(0, 4),
    rows: table.rows.slice(0, 3),
  };
}

function expandLesson(def: RawLessonDef): Lesson {
  const isPlSql =
    def.sql.toUpperCase().includes("DECLARE") ||
    def.sql.toUpperCase().includes("BEGIN") ||
    def.sql.toUpperCase().includes("CREATE ");

  let tableName = "employees";
  const fromMatch = def.sql.match(/from\s+([a-z0-9_]+)/i);
  if (fromMatch && fromMatch[1]) {
    const t = fromMatch[1].toLowerCase();
    if (SCHEMAS_DATABASE_RAW[t]) tableName = t;
  }
  const fakeDb =
    SCHEMAS_DATABASE_RAW[tableName] || SCHEMAS_DATABASE_RAW.employees;

  const matchedKeywords = detectKeywords(def.sql);

  let columns: string[] = [];
  let rows: any[] = [];
  let ascii_table = "";

  if (isPlSql) {
    columns = ["PL/SQL Executive Message"];
    rows = [
      {
        "PL/SQL Executive Message": "PL/SQL procedure successfully completed.",
      },
    ];
    ascii_table = `+-----------------------------------------+\n| PL/SQL Executive Message                |\n+-----------------------------------------+\n| PL/SQL procedure completed.             |\n+-----------------------------------------+`;
  } else {
    const runResult = mockExecuteSQL(def.sql, fakeDb);
    columns = runResult.columns;
    rows = runResult.rows;

    ascii_table =
      `+` +
      columns.map((c) => "-".repeat(Math.max(c.length + 2, 12))).join("+") +
      `+\n`;
    ascii_table +=
      `|` +
      columns.map((c) => ` ${c.padEnd(Math.max(c.length, 10))} `).join("|") +
      `|\n`;
    ascii_table +=
      `+` +
      columns.map((c) => "-".repeat(Math.max(c.length + 2, 12))).join("+") +
      `+\n`;
    rows.slice(0, 4).forEach((r) => {
      ascii_table +=
        `|` +
        columns
          .map(
            (c) =>
              ` ${String(r[c] || "")
                .substring(0, 10)
                .padEnd(Math.max(c.length, 10))} `,
          )
          .join("|") +
        `|\n`;
    });
    ascii_table +=
      `+` +
      columns.map((c) => "-".repeat(Math.max(c.length + 2, 12))).join("+") +
      `+`;
  }

  const { important_rules, things_to_remember, common_beginner_mistakes } =
    buildRulesRememberMistakes(def.sql, isPlSql);

  return {
    id: `lesson_${String(def.num).padStart(3, "0")}`,
    phase: def.phase,
    level: def.level,
    lesson_number: def.num,
    title: def.title,
    difficulty: def.diff,
    query_type: def.type,
    sql: def.sql,
    short_description: def.desc,
    real_world_use_case: def.use,
    goal_of_this_query: def.goal,
    before_learning: {
      required_knowledge: [
        "Understanding of tables and Oracle schema design basics.",
      ],
      new_concepts: matchedKeywords.length > 0 ? matchedKeywords : [def.type],
    },
    keyword_breakdown: buildKeywordBreakdown(def.sql, def.title),
    line_by_line_explanation: buildLineByLineExplanation(def.sql, isPlSql),
    execution_flow: buildExecutionFlow(def.sql, isPlSql, def.use),
    fake_database: fakeDb,
    step_by_step_execution: [
      "1. Locates the active data block or table referenced by the statement.",
      "2. Evaluates each clause or line in the order Oracle actually processes it.",
      "3. Returns the formatted result set (or completion message) to the client layer.",
    ],
    final_result: {
      columns,
      rows,
    },
    output_table: {
      ascii_table,
    },
    visual_explanation: {
      diagram: buildVisualDiagram(def.sql, isPlSql),
    },
    important_rules,
    things_to_remember,
    common_beginner_mistakes,
    how_to_modify_this_query: [
      {
        change: "Adjust the filter, grouping, or bound values",
        new_sql: def.sql,
        effect:
          "Changes which rows, groups, or values are affected without altering the overall structure of the statement.",
      },
    ],
    practice_variations: [
      `Try adapting this exact structure with different criteria for: ${def.title}`,
    ],
    quiz: buildQuiz(def, matchedKeywords),
    coding_challenge: {
      prompt: `Write the statement needed to complete: "${def.title}"`,
      hints: [
        "Check the clause order matches what this lesson demonstrated",
        "Make sure every opened keyword (BEGIN, LOOP, IF) has its matching close",
      ],
    },
    expected_answer: def.ans,
    related_lessons: ["lesson_001"],
  };
}

// Raw table schemas to prevent circular imports during parsing
const SCHEMAS_DATABASE_RAW: Record<string, TableData> = {
  employees: HANDWRITTEN_LESSONS[0].fake_database,
  departments: {
    table_name: "departments",
    columns: ["department_id", "department_name", "manager_id", "location_id"],
    rows: [
      {
        department_id: 10,
        department_name: "Administration",
        manager_id: 200,
        location_id: 1700,
      },
      {
        department_id: 20,
        department_name: "Marketing",
        manager_id: 201,
        location_id: 1800,
      },
      {
        department_id: 50,
        department_name: "Shipping",
        manager_id: 124,
        location_id: 1500,
      },
      {
        department_id: 60,
        department_name: "IT",
        manager_id: 103,
        location_id: 1400,
      },
      {
        department_id: 80,
        department_name: "Sales",
        manager_id: 145,
        location_id: 2500,
      },
      {
        department_id: 90,
        department_name: "Executive",
        manager_id: 100,
        location_id: 1700,
      },
    ],
  },
  jobs: {
    table_name: "jobs",
    columns: ["job_id", "job_title", "min_salary", "max_salary"],
    rows: [
      {
        job_id: "AD_PRES",
        job_title: "President",
        min_salary: 20080,
        max_salary: 40000,
      },
      {
        job_id: "AD_VP",
        job_title: "Administration Vice President",
        min_salary: 15000,
        max_salary: 30000,
      },
      {
        job_id: "IT_PROG",
        job_title: "Programmer",
        min_salary: 4000,
        max_salary: 10000,
      },
      {
        job_id: "SA_REP",
        job_title: "Sales Representative",
        min_salary: 6000,
        max_salary: 12008,
      },
      {
        job_id: "ST_CLERK",
        job_title: "Stock Clerk",
        min_salary: 2008,
        max_salary: 5000,
      },
    ],
  },
  locations: {
    table_name: "locations",
    columns: [
      "location_id",
      "street_address",
      "postal_code",
      "city",
      "state_province",
      "country_id",
    ],
    rows: [
      {
        location_id: 1400,
        street_address: "2014 Jabberwocky Rd",
        postal_code: "26192",
        city: "Southlake",
        state_province: "Texas",
        country_id: "US",
      },
      {
        location_id: 1500,
        street_address: "2011 Interiors Blvd",
        postal_code: "99236",
        city: "South San Francisco",
        state_province: "California",
        country_id: "US",
      },
      {
        location_id: 1700,
        street_address: "2007 Zagora St",
        postal_code: "50902",
        city: "Munich",
        state_province: "Bavaria",
        country_id: "DE",
      },
      {
        location_id: 1800,
        street_address: "147 Spadina Ave",
        postal_code: "M5V 2L7",
        city: "Toronto",
        state_province: "Ontario",
        country_id: "CA",
      },
    ],
  },
};

export const SCHEMAS_DATABASE = SCHEMAS_DATABASE_RAW;

export const LESSONS: Lesson[] = [
  ...HANDWRITTEN_LESSONS,
  ...buildGeneratedLessons(),
];
