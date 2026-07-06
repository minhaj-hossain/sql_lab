export interface MCQ {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

export interface TrueFalse {
  statement: string;
  answer: boolean;
  explanation: string;
}

export interface PredictOutput {
  sql: string;
  correct_output: string;
  explanation: string;
}

export interface FindError {
  broken_sql: string;
  error: string;
  fixed_sql: string;
}

export interface WriteSQLChallenge {
  prompt: string;
  expected_answer: string;
}

export interface Quiz {
  mcq: MCQ[];
  true_false: TrueFalse[];
  predict_output: PredictOutput[];
  find_error: FindError[];
  write_sql_challenge: WriteSQLChallenge[];
}

export interface KeywordBreakdown {
  keyword: string;
  meaning: string;
  why_we_use_it: string;
  easy_example: string;
  common_mistake: string;
}

export interface QueryModification {
  change: string;
  new_sql: string;
  effect: string;
}

export interface TableData {
  table_name: string;
  columns: string[];
  rows: Record<string, any>[];
}

export interface Lesson {
  id: string;
  phase: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lesson_number: number;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  query_type: string;
  sql: string;
  short_description: string;
  real_world_use_case: string;
  goal_of_this_query: string;
  before_learning: {
    required_knowledge: string[];
    new_concepts: string[];
  };
  keyword_breakdown: KeywordBreakdown[];
  line_by_line_explanation: string[];
  execution_flow: string[];
  fake_database: TableData;
  step_by_step_execution: string[];
  final_result: {
    columns: string[];
    rows: Record<string, any>[];
  };
  output_table: {
    ascii_table: string;
  };
  visual_explanation: {
    diagram: string;
  };
  important_rules: string[];
  things_to_remember: string[];
  common_beginner_mistakes: string[];
  how_to_modify_this_query: QueryModification[];
  practice_variations: string[];
  quiz: Quiz;
  coding_challenge: {
    prompt: string;
    hints: string[];
  };
  expected_answer: string;
  related_lessons: string[];
}

export interface Phase {
  phase_id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  lesson_range: string;
  covers: string[];
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  lastActive: string | null;
  completedLessons: string[]; // array of lesson IDs
  unlockedPhases: string[]; // phase IDs
  badges: string[]; // badge IDs
  notes: Record<string, string>; // lesson ID -> user note text
  bookmarks: string[]; // lesson IDs
  userId?: string;
  username?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired: number;
}

export interface QueryExecutionStep {
  type: 'open_table' | 'scan_row' | 'filter_row' | 'keep_row' | 'project_columns' | 'sort_results' | 'complete';
  message: string;
  currentRowIndex?: number;
  matched?: boolean;
  tempRows?: Record<string, any>[];
  targetColumns?: string[];
}
