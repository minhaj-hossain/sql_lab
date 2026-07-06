const ADJECTIVES = [
  'SELECTive',
  'Indexed',
  'Normalized',
  'Optimized',
  'Relational',
  'Recursive',
  'Transactional',
  'Oracle',
  'PLSQL',
  'Committed',
  'Compiled',
  'Deterministic',
  'Immutable'
];

const NOUNS = [
  'Scribe',
  'Architect',
  'Ninja',
  'Wizard',
  'Champion',
  'Guru',
  'Scholar',
  'Savant',
  'Analyst',
  'Enthusiast',
  'Debugger',
  'Compiler',
  'Optimizer'
];

export function generateAnonymousUser(): { userId: string; username: string } {
  const randAdj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const randNoun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const randNum = Math.floor(100 + Math.random() * 900); // 100 to 999
  
  const username = `${randAdj}_${randNoun}_${randNum}`;
  
  // Simple UUID-style random string generator
  const randomStr = Math.random().toString(36).substring(2, 10);
  const userId = `sql_usr_${randomStr}`;
  
  return { userId, username };
}
