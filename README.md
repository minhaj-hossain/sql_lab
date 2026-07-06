# 🎓 MJ - SQL LAB

[![Live Demo](https://img.shields.io/badge/Live_Demo-sql--lab--pi.vercel.app-teal?style=flat-square&logo=vercel)](https://sql-lab-pi.vercel.app)
[![Vibe Coded](https://img.shields.io/badge/Vibe_Coded-%E2%9C%A8-0d9488?style=flat-square)](#)

Welcome to **MJ - SQL LAB** (formerly SQL & PL/SQL Academy), a premium, professional-grade interactive learning platform designed to take developers from SQL absolute basics to Oracle PL/SQL master wizards. It features full step-by-step query execution visualization, an elegant live compiler terminal, gamified quizzes, interactive coding challenges, and dynamic data previews.

🔗 **Live Link**: [sql-lab-pi.vercel.app](https://sql-lab-pi.vercel.app)

---

## 🌟 Key Features

### 1. Professional Educator-Grade Analysis & Vocabulary

- **Deep Line-by-Line Code Breakdown**: Programmatically evaluates user queries and lesson examples, splitting them into logical statements with academic-grade explanation blocks.
- **Expanded Core Keyword Vocabulary**: Interactive, expandable drawers detailing SQL/PL-SQL keywords. Each keyword includes:
  - **Academic Definition**: Precise relational engine behaviors.
  - **In Practice (Example)**: Real-world syntax samples in high-contrast editor panels.
  - **Why We Use It**: Practical system advantages (e.g., eliminating context switching).
  - **Common Pitfalls**: Vital warnings (e.g., avoiding accidental Cartesian Products or missing ELSE fallbacks).

### 2. Unified Live Compiler & Visualizer

- **Procedural PL/SQL Block Simulation**: Supports `DECLARE`, `BEGIN`, and `EXCEPTION` structures. Captures and evaluates printed messages from `DBMS_OUTPUT.PUT_LINE` on a custom virtual buffer.
- **Step-by-Step Execution Plan**: Visualizes how Oracle resolves queries internally. It runs you through filtering rows (WHERE), groupings (GROUP BY), aggregate checks (HAVING), projections (SELECT), and final sorting (ORDER BY) via an animated trace.
- **Dynamic Data Table Integration**: The visualizer's input table dynamically switches schema structures in real-time based on the table specified in the editor's query (supporting `employees`, `departments`, `jobs`, and `locations` tables).

### 3. Full-Fledged Interactive Quiz Deck

Each of the curated lessons features a dedicated, gamified test suite:

- **MCQ Section**: Conceptual multiple-choice questions targeting the lesson's focal points.
- **True/False Checks**: Core structural fact checks to build reliable fundamentals.
- **Coding Challenges**: A sandbox that parses custom queries and compares them with expected Oracle statements, unlocking +50 XP and leveling up.

### 4. Progressive Phases & Gamification

- **Structured Progression**: Structured phases ranging from Phase 1 (SQL basics) to PL/SQL advanced programming.
- **Progress Dashboard**: Keep track of your XP, active streak, earned achievement badges, bookmarked lessons, and persistent lecture notes.
- **Level 11 Quickstart**: Every user receives a complimentary **1000 XP** bonus, launching them instantly into Level 11 to unlock advanced learning tracks.

---

## 📂 Project Architecture

```bash
├── src/
│   ├── components/
│   │   ├── CourseMap.tsx       # Main timeline tree & progress dashboard
│   │   ├── LessonView.tsx      # Comprehensive interactive playground and theory viewer
│   │   └── Navbar.tsx          # Clean header with stats and theme controls
│   ├── data/
│   │   └── lessons.ts          # Complete database of handwritten and generated lessons
│   ├── utils/
│   │   └── sqlRunner.ts        # The SQL/PL-SQL parser and sandbox runtime
│   ├── App.tsx                 # Core application entry point and state coordinator
│   ├── index.css               # Tailored styles and font selections
│   └── types.ts                # Shared TypeScript structures and interfaces
│   └── main.tsx                # React entry point
├── package.json
└── metadata.json
```

---

## 💡 How to Get the Most Out of This Lab

1.  **Follow the Timeline**: Start from Phase 1, Lesson 1. The missions are curated to build concepts progressively.
2.  **Use the Lecture Notes**: As you learn, use the **Your Lecture Notes** workspace in the sidebar to jot down syntax shortcuts. They persist automatically using your browser state.
3.  **Experiment in the Playground**: Don't just run the target query! Try updating variables, writing your own loops, or combining conditions. The dynamic input table will automatically pivot to mirror your active query.
4.  **Claim Your Badges**: Try answering all MCQs and completing coding challenges to rack up XP and secure your graduate status badges.

---

## 🛠️ How to Add, Customize, and Remove Lessons

All lessons in the system are defined inside **`src/data/lessons.ts`**. The file combines two types of lessons into a single export named `LESSONS`:

- **Handwritten Lessons**: Fully detailed, manual lessons written directly at the top of the file inside `HANDWRITTEN_LESSONS`.
- **Generated Lessons**: Programmatically created lessons generated using parameter matrices inside `buildGeneratedLessons()`.

### 1. How to Add a New Lesson

You can add a lesson either by writing it by hand or by appending a raw definition to the generator matrix:

#### Method A: Adding a Handwritten Lesson

Simply insert a new object into the `HANDWRITTEN_LESSONS` array at the top of `src/data/lessons.ts`:

```typescript
const HANDWRITTEN_LESSONS: Lesson[] = [
  // ... existing lessons ...
  {
    id: "lesson_100", // Unique identifier
    phase: "phase_1", // Phase grouping: phase_1, phase_2, or phase_3
    level: "beginner", // Difficulty level: beginner, intermediate, advanced, expert
    lesson_number: 100, // Sequence index
    title: "Understanding Oracle NVL Functions",
    difficulty: "easy",
    query_type: "NVL basics",
    sql: "SELECT employee_id, NVL(commission_pct, 0) FROM employees;",
    short_description:
      "Learn how to replace NULL values with standard default values in Oracle.",
    real_world_use_case:
      "Financial ledgers use NVL to convert unearned commissions to 0 for tax calculations.",
    goal_of_this_query: "To handle nullable columns gracefully.",
    before_learning: {
      required_knowledge: ["Basic SELECT statements", "Handling NULL values"],
      new_concepts: ["NVL function"],
    },
    keyword_breakdown: [
      {
        keyword: "NVL",
        meaning: "Replaces a NULL value with a substitute.",
        why_we_use_it:
          "Prevents math operations from failing due to empty cells.",
        easy_example: "NVL(bonus, 0) returns 0 if bonus is empty.",
        common_mistake:
          "Type mismatch between the column and the replacement value.",
      },
    ],
    line_by_line_explanation: [
      "SELECT employee_id -> reads worker primary keys",
      "NVL(commission_pct, 0) -> replaces NULL pct with 0",
      "FROM employees -> fetches from table employees",
    ],
    execution_flow: [
      "Oracle reads from employees table.",
      "Checks commission_pct value per row, replacing NULL with 0.",
    ],
    fake_database: SCHEMAS_DATABASE_RAW.employees,
    step_by_step_execution: [
      "1. Locates employees table.",
      "2. Evaluates the NVL condition on nulls.",
      "3. Projects columns.",
    ],
    final_result: {
      columns: ["employee_id", "NVL(commission_pct, 0)"],
      rows: [
        { employee_id: 100, "NVL(commission_pct, 0)": 0 },
        { employee_id: 145, "NVL(commission_pct, 0)": 0.2 },
      ],
    },
    output_table: {
      ascii_table:
        "+-------------+-------------------------+\n| employee_id | NVL(commission_pct, 0)  |\n+-------------+-------------------------+\n| 100         | 0                       |\n+-------------+-------------------------+",
    },
    visual_explanation: {
      diagram: "Read rows -> If NULL replace with 0 -> Project output",
    },
    important_rules: ["Replacement value must match column type."],
    things_to_remember: [
      "NVL is specific to Oracle databases; other DBs use COALESCE.",
    ],
    common_beginner_mistakes: [
      "Using incompatible types inside NVL parameters.",
    ],
    how_to_modify_this_query: [
      {
        change: "Change default value",
        new_sql: "SELECT employee_id, NVL(commission_pct, 0.1) FROM employees;",
        effect: "Replaces empty entries with 0.1 instead of 0.",
      },
    ],
    practice_variations: ["Try replacing nullable manager_id fields with NVL."],
    quiz: {
      mcq: [
        {
          question: "What does the Oracle NVL function do?",
          options: [
            "Replaces empty/NULL values with a specified default",
            "Deletes rows containing NULL values",
            "Truncates columns to zero",
          ],
          correct_answer: "Replaces empty/NULL values with a specified default",
          explanation:
            "NVL replaces NULL fields with whatever default value is provided as the second argument.",
        },
      ],
      true_false: [
        {
          statement: "NVL stands for Null Value Logic.",
          answer: false,
          explanation: "NVL stands for Null Value.",
        },
      ],
      predict_output: [
        {
          sql: "SELECT NVL(null, 5) FROM dual;",
          correct_output: "Returns 5.",
          explanation:
            "Since the first argument is null, the default argument is evaluated and returned.",
        },
      ],
      find_error: [
        {
          broken_sql: "SELECT NVL(commission_pct, 'None') FROM employees;",
          error:
            "Type mismatch: commission_pct is numeric, but 'None' is a string.",
          fixed_sql: "SELECT NVL(commission_pct, 0) FROM employees;",
        },
      ],
      write_sql_challenge: [
        {
          prompt:
            "Write a query to show employee_id and replace null commission_pct with 0.",
          expected_answer:
            "SELECT employee_id, NVL(commission_pct, 0) FROM employees;",
        },
      ],
    },
    coding_challenge: {
      prompt: "Write the query to replace null commission percents with 0.",
      hints: ["Use the NVL function with 0 as the second argument."],
    },
    expected_answer:
      "SELECT employee_id, NVL(commission_pct, 0) FROM employees;",
    related_lessons: ["lesson_001"],
  },
];
```

#### Method B: Adding a Generated Lesson

Scroll down inside `src/data/lessons.ts` to search for `buildGeneratedLessons()`. Under topics matrices (like `RAW_P1_TOPICS`, `RAW_P2_TOPICS`, or `RAW_P3_TOPICS`), append a new lightweight `RawLessonDef` item:

```typescript
{
  num: 52, // Sequential number
  phase: "phase_3",
  lvl: "advanced",
  title: "Oracle Autonomous Logging Procedures",
  diff: "hard",
  type: "PL/SQL Transactions",
  sql: "DECLARE\n  PROCEDURE log_action IS\n    PRAGMA AUTONOMOUS_TRANSACTION;\n  BEGIN\n    INSERT INTO audit_logs VALUES ('Action logs');\n    COMMIT;\n  END;\nBEGIN\n  log_action;\nEND;",
  desc: "Understand how PRAGMA AUTONOMOUS_TRANSACTION keeps auditing operations isolated.",
  use: "Used in real banking log registers to commit tracing logs even if the main money transfer rolls back.",
  goal: "Execute an independent sub-transaction safely.",
  ans: "DECLARE PROCEDURE log_action IS PRAGMA AUTONOMOUS_TRANSACTION; BEGIN INSERT INTO audit_logs VALUES ('Action logs'); COMMIT; END; BEGIN log_action; END;"
}
```

The internal compiler generator `expandLesson()` will automatically expand this raw definition into a highly detailed `Lesson` object complete with visual diagrams, execution plan steps, and fully functioning quizzes!

---

### 2. How to Customize an Existing Lesson

- **For Handwritten Lessons**: Find the lesson object matching your target `id` in `HANDWRITTEN_LESSONS` (e.g. `"lesson_001"`). Modify any property like `sql`, `title`, or `short_description` directly.
- **For Generated Lessons**: Find the raw record in the topic arrays inside `buildGeneratedLessons()` matching your target `num` or `title`. Update the SQL or description there.

---

### 3. How to Remove a Lesson

- **To remove a handwritten lesson**: Delete its object block from the `HANDWRITTEN_LESSONS` array.
- **To remove a generated lesson**: Locate its raw definition block inside the respective `RAW_P_TOPICS` array in `buildGeneratedLessons()` and delete it.
- _Note_: Ensure that lesson numbers remain unique to maintain clean progress state indexing.

---

Enjoy your journey in becoming an Oracle SQL & PL/SQL master wizard! 🚀
