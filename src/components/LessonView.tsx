import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lesson, UserStats, QueryExecutionStep } from '../types';
import { parseAndExecuteSQL, SQLRunnerResult } from '../utils/sqlRunner';
import { SCHEMAS_DATABASE, LESSONS } from '../data/lessons';
import { 
  Play, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Terminal, 
  Sparkles, 
  Bookmark, 
  Database,
  ArrowRight,
  ChevronRight,
  Lightbulb,
  Check,
  Code,
  Sun,
  Moon
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  userStats: UserStats;
  onLessonCompleted: (lessonId: string, xpGained: number) => void;
  onClose: () => void;
  onSaveNotes: (lessonId: string, text: string) => void;
  onToggleBookmark: (lessonId: string) => void;
  theme?: 'light' | 'dark' | 'terminal';
  setTheme?: React.Dispatch<React.SetStateAction<'light' | 'dark' | 'terminal'>>;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
}

export default function LessonView({
  lesson,
  userStats,
  onLessonCompleted,
  onClose,
  onSaveNotes,
  onToggleBookmark,
  theme,
  setTheme,
  onNextLesson,
  onPrevLesson
}: LessonViewProps) {
  const currentIndex = LESSONS.findIndex(l => l.id === lesson.id);
  const isFirstLesson = currentIndex <= 0;
  const isLastLesson = currentIndex === -1 || currentIndex >= LESSONS.length - 1;

  // Tabs for Right Panel: 'visualizer' | 'quiz'
  const [rightTab, setRightTab] = useState<'visualizer' | 'quiz'>('visualizer');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerWidth, setDrawerWidth] = useState<number>(55); // customizable width percent
  const [toast, setToast] = useState<string | null>(null);
  
  // Custom responsive layout detector state
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  
  // Custom Editor State
  const [editorSql, setEditorSql] = useState(lesson.sql);
  const [editorResult, setEditorResult] = useState<SQLRunnerResult | null>(null);

  // Visualization States
  const [isPlaying, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [vizSteps, setVizSteps] = useState<QueryExecutionStep[]>([]);
  const [activeStep, setActiveStep] = useState<QueryExecutionStep | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Quiz States
  const [quizSection, setQuizSection] = useState<'mcq' | 'tf' | 'challenge'>('mcq');
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, string>>({});
  const [tfAnswers, setTfAnswers] = useState<Record<number, boolean>>({});
  const [codeChallengePassed, setCodeChallengePassed] = useState(false);

  // Notes & Bookmark
  const [noteText, setNoteText] = useState(userStats.notes[lesson.id] || '');
  const [isBookmarked, setIsBookmarked] = useState(userStats.bookmarks.includes(lesson.id));

  // Get active input table based on current editor SQL (dynamic data table based on the screen query)
  const getActiveInputTable = () => {
    const match = editorSql.match(/from\s+([a-z0-9_]+)/i);
    if (match && match[1]) {
      const tableName = match[1].toLowerCase();
      if (SCHEMAS_DATABASE[tableName]) {
        return SCHEMAS_DATABASE[tableName];
      }
    }
    return lesson.fake_database;
  };
  const activeInputTable = getActiveInputTable();

  // Load lesson
  useEffect(() => {
    setEditorSql(lesson.sql);
    setIsActive(false);
    setCurrentStepIndex(0);
    setActiveStep(null);
    setMcqAnswers({});
    setTfAnswers({});
    setCodeChallengePassed(false);
    setNoteText(userStats.notes[lesson.id] || '');
    setIsBookmarked(userStats.bookmarks.includes(lesson.id));

    // Generate visualization steps for the lesson starting query
    const res = parseAndExecuteSQL(lesson.sql);
    setEditorResult(res);
    if (res.success) {
      setVizSteps(res.steps);
    }
  }, [lesson]);

  // Handle Play/Pause of Visualizer Animation
  const startVisualizer = () => {
    if (isPlaying) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsActive(false);
      return;
    }

    setIsActive(true);
    const startIndex = currentStepIndex >= vizSteps.length - 1 ? 0 : currentStepIndex;
    setCurrentStepIndex(startIndex);
    setActiveStep(vizSteps[startIndex]);

    intervalRef.current = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= vizSteps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsActive(false);
          return prevIndex;
        }
        setActiveStep(vizSteps[nextIndex]);
        return nextIndex;
      });
    }, 1200); // slightly faster than default for smoother, premium pacing
  };

  const resetVisualizer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setCurrentStepIndex(0);
    setActiveStep(vizSteps[0] || null);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Run Custom SQL Query in Editor
  const runCustomQuery = () => {
    const res = parseAndExecuteSQL(editorSql);
    setEditorResult(res);
    
    if (res.success) {
      setVizSteps(res.steps);
      setCurrentStepIndex(0);
      setActiveStep(res.steps[0]);
      
      // Auto switch to visualizer tab so they see it animate!
      setRightTab('visualizer');
      setIsDrawerOpen(true);
      
      // Check if user has written the expected coding challenge answer
      const cleanInput = editorSql.trim().replace(/\s+/g, ' ').replace(/;$/, '').toUpperCase();
      const cleanExpected = lesson.expected_answer.trim().replace(/\s+/g, ' ').replace(/;$/, '').toUpperCase();
      
      if (cleanInput === cleanExpected) {
        setCodeChallengePassed(true);
      }
    }
  };

  // Submit MCQ
  const handleMcqSelect = (idx: number, opt: string) => {
    setMcqAnswers(prev => ({ ...prev, [idx]: opt }));
  };

  // Submit T/F
  const handleTfSelect = (idx: number, val: boolean) => {
    setTfAnswers(prev => ({ ...prev, [idx]: val }));
  };

  // Finish lesson & claim XP
  const finishLesson = () => {
    const isAlreadyCompleted = userStats.completedLessons.includes(lesson.id);
    if (isAlreadyCompleted) {
      setToast("Review Mode: You've already mastered this mission and claimed its XP!");
    } else {
      const earnedXp = 50; 
      onLessonCompleted(lesson.id, earnedXp);
    }
  };

  return (
    <div className="h-full bg-surface-bright flex flex-col overflow-hidden font-sans" id="lesson-workspace">
      
      {/* Lesson Header Rail */}
      <div className="h-16 px-2 sm:px-4 md:px-8 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button 
            onClick={onClose}
            className="text-xs font-mono font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-1 px-2 py-1.5 rounded border border-outline-variant hover:bg-surface-container cursor-pointer"
            id="back-to-course-btn"
          >
            <span>←</span>
            <span className="hidden sm:inline ml-0.5">Back</span>
          </button>

          {onPrevLesson && (
            <button
              onClick={onPrevLesson}
              disabled={isFirstLesson}
              className="p-1.5 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container cursor-pointer text-[10px] sm:text-xs transition-all"
              title="Previous Mission"
              id="header-prev-btn"
            >
              <span>◀</span>
            </button>
          )}

          {onNextLesson && (
            <button
              onClick={onNextLesson}
              disabled={isLastLesson}
              className="p-1.5 rounded border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-container cursor-pointer text-[10px] sm:text-xs transition-all"
              title="Next Mission"
              id="header-next-btn"
            >
              <span>▶</span>
            </button>
          )}
          <div className="h-4 w-px bg-outline-variant" />
          <div className="min-w-0">
            <p className="text-[9px] uppercase font-bold font-mono text-primary tracking-wider truncate max-w-[80px] xs:max-w-[110px] sm:max-w-none">
              {isMobile ? `Lsn ${lesson.lesson_number}` : `Lesson ${lesson.lesson_number}`} • {lesson.query_type}
            </p>
            <h2 className="text-xs sm:text-sm font-bold text-on-surface truncate max-w-[80px] xs:max-w-[120px] sm:max-w-xs md:max-w-md" title={lesson.title}>
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Notes & Bookmark Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Optional Theme Cycler inside lesson */}
          {theme && setTheme && (
            <button
              onClick={() => {
                setTheme(prev => {
                  if (prev === 'light') return 'dark';
                  if (prev === 'dark') return 'terminal';
                  return 'light';
                });
              }}
              className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all cursor-pointer flex items-center gap-1 font-mono text-[9px] sm:text-[10px] font-bold"
              title="Change Aesthetic Theme"
            >
              {theme === 'light' && <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {theme === 'dark' && <Moon className="w-3.5 h-3.5 text-indigo-400" />}
              {theme === 'terminal' && <Terminal className="w-3.5 h-3.5 text-emerald-500" />}
              <span className="hidden md:inline uppercase tracking-wider">{theme}</span>
            </button>
          )}

          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className={`flex items-center gap-1 px-1.5 py-1.5 rounded border transition-all cursor-pointer text-xs font-mono font-bold ${
              isDrawerOpen 
                ? 'bg-primary-fixed border-outline-variant text-primary' 
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}
            title={isDrawerOpen ? "Hide Playground Drawer" : "Show Playground Drawer"}
            id="lesson-drawer-toggle-btn"
          >
            <Terminal size={14} className={isDrawerOpen ? "text-primary" : "text-on-surface-variant"} />
            <span className="hidden sm:inline">{isDrawerOpen ? "Hide Drawer" : "Show Drawer"}</span>
            <span className="inline sm:hidden">{isDrawerOpen ? "Hide" : "Show"}</span>
          </button>

          <button
            onClick={() => {
              onToggleBookmark(lesson.id);
              setIsBookmarked(!isBookmarked);
            }}
            className={`p-1.5 rounded border transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-500/10 border-amber-400 text-amber-500' 
                : 'bg-surface-container-lowest border-outline-variant text-on-surface-variant hover:text-on-surface'
            }`}
            title="Bookmark Lesson"
            id="lesson-bookmark-btn"
          >
            <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={finishLesson}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[10px] sm:text-xs uppercase tracking-wider px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg border border-emerald-700 cursor-pointer shadow-sm flex items-center gap-1 shrink-0 animate-pulse hover:animate-none"
            id="finish-claim-xp-btn"
          >
            <CheckCircle2 size={13} />
            <span className="hidden sm:inline">Claim XP</span>
            <span className="inline sm:hidden">Claim</span>
          </button>
        </div>
      </div>

      {/* Main Core split pane workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT COLUMN: Concept/Theory Viewer */}
        <motion.div 
          animate={{ 
            width: isMobile 
              ? (isDrawerOpen ? '0%' : '100%') 
              : (isDrawerOpen ? `${100 - drawerWidth}%` : '100%') 
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={`h-full border-r border-outline-variant bg-surface-container-lowest overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin ${
            isMobile && isDrawerOpen ? 'hidden' : 'block'
          }`}
        >
          
          {/* Header context */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-mono font-bold uppercase text-primary tracking-widest bg-primary-fixed px-2 py-0.5 rounded border border-outline-variant/30">
                Oracle SQL Core
              </span>
              <span className="text-[11px] font-serif italic text-primary">+50 XP Reward</span>
            </div>
            <h1 className="text-xl font-extrabold text-on-surface tracking-tight leading-snug">{lesson.title}</h1>
            <p className="text-xs text-on-surface-variant leading-relaxed font-serif">
              {lesson.short_description}
            </p>
          </div>

          {/* Real World Case study banner */}
          <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-mono font-bold text-on-surface uppercase text-[9px] tracking-wider">
              <Sparkles size={12} className="text-primary" />
              <span>Real-World Scenario Context</span>
            </div>
            <p className="text-on-surface-variant italic leading-relaxed font-serif">
              "{lesson.real_world_use_case}"
            </p>
          </div>

          {/* Core query breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Target Query Block</h3>
              {!isDrawerOpen && (
                <button
                  onClick={() => {
                    setIsDrawerOpen(true);
                    setRightTab('visualizer');
                  }}
                  className="text-[9px] font-mono font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Play size={9} />
                  <span>Open Playground</span>
                </button>
              )}
            </div>
            <div className="p-4 rounded-xl bg-[#11151C] text-slate-100 font-mono text-xs leading-relaxed border border-slate-800 shadow-inner relative select-all">
              <code className="block text-indigo-250 font-bold">{lesson.sql}</code>
            </div>
          </div>

          {/* Line by line breakdown */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Line-by-Line Analysis</span>
            </h3>
            <div className="space-y-3 bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/40">
              {lesson.line_by_line_explanation.map((line, idx) => {
                const parts = line.split("->");
                const codePart = parts[0]?.trim();
                const explanationPart = parts.slice(1).join("->")?.trim();
                
                return (
                  <div key={idx} className="flex gap-3.5 items-start text-xs leading-relaxed text-on-surface-variant font-sans">
                    <span className="w-6 h-6 rounded-lg border border-outline-variant/50 bg-surface-container-low font-mono text-[10px] font-extrabold text-primary flex items-center justify-center shrink-0 shadow-sm">
                      {idx + 1}
                    </span>
                    <div className="space-y-1 pt-0.5 flex-1">
                      {explanationPart ? (
                        <>
                          <div className="font-mono text-[11px] font-bold text-[#14b8a6] bg-teal-500/5 px-2.5 py-1 rounded border border-teal-500/10 w-fit inline-block mb-1 break-all">
                            {codePart}
                          </div>
                          <p className="text-on-surface leading-relaxed text-[13px] font-medium pl-1">{explanationPart}</p>
                        </>
                      ) : (
                        <p className="text-on-surface leading-relaxed text-[13px] font-medium pl-1">{line}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyword breakdowns details */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant font-mono flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Core Keyword Vocabulary</span>
            </h3>
            <div className="space-y-3">
              {lesson.keyword_breakdown.map((kw, idx) => (
                <details key={idx} className="group p-4 rounded-xl border border-outline-variant/60 bg-surface-container-lowest hover:border-primary/40 transition-all [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer font-extrabold text-[13px] text-on-surface font-mono select-none">
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono bg-primary/5 px-2.5 py-1 rounded-md border border-primary/10">{kw.keyword}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-serif font-medium text-primary group-hover:underline">
                      <span>Expand Concept</span>
                      <ChevronRight size={14} className="transform group-open:rotate-90 transition-transform duration-200" />
                    </div>
                  </summary>
                  
                  <div className="pt-4 space-y-4 border-t border-outline-variant/50 mt-3 text-xs leading-relaxed text-on-surface-variant font-sans">
                    {/* Definition */}
                    <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/40 space-y-1">
                      <span className="font-mono font-extrabold text-[9px] tracking-wider uppercase text-primary flex items-center gap-1.5">
                        <BookOpen size={11} /> Definition
                      </span>
                      <p className="text-on-surface text-[12.5px] font-medium leading-relaxed">
                        {kw.meaning}
                      </p>
                    </div>

                    {/* Why we use it */}
                    {kw.why_we_use_it && (
                      <div className="space-y-1 pl-1">
                        <span className="font-mono font-extrabold text-[9px] tracking-wider uppercase text-on-surface flex items-center gap-1.5">
                          <Lightbulb size={11} className="text-amber-500" /> Why We Use It
                        </span>
                        <p className="text-on-surface-variant text-[12px] leading-relaxed">
                          {kw.why_we_use_it}
                        </p>
                      </div>
                    )}

                    {/* Easy Example */}
                    {kw.easy_example && (
                      <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/30 space-y-1.5">
                        <span className="font-mono font-extrabold text-[9px] tracking-wider uppercase text-on-surface flex items-center gap-1.5">
                          <Code size={11} className="text-teal-500" /> In Practice (Example)
                        </span>
                        <code className="block bg-[#11151C] text-[#14b8a6] p-2.5 rounded-md font-mono text-[11px] border border-slate-800 leading-relaxed break-all select-all">
                          {kw.easy_example}
                        </code>
                      </div>
                    )}

                    {/* Common Mistake */}
                    {kw.common_mistake && (
                      <div className="space-y-1.5 bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                        <span className="font-mono font-extrabold text-[9px] tracking-wider uppercase text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                          ⚠️ Avoid This Common Pitfall
                        </span>
                        <p className="text-on-surface-variant text-[12px] leading-relaxed">
                          {kw.common_mistake}
                        </p>
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>

          {/* Notes Workspace Box */}
          <div className="border-t border-outline-variant/60 pt-5 space-y-2">
            <h3 className="text-[9px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">Your Lecture Notes</h3>
            <textarea
              value={noteText}
              onChange={(e) => {
                setNoteText(e.target.value);
                onSaveNotes(lesson.id, e.target.value);
              }}
              placeholder="Jot down formulas, keywords, or observations..."
              className="w-full h-24 p-3 text-xs border border-outline-variant rounded-xl bg-surface-container-low text-on-surface focus:outline-none focus:ring-1 focus:ring-primary font-serif leading-relaxed resize-none"
            />
          </div>

          {/* Lecture Navigation Footer */}
          <div className="border-t border-outline-variant/60 pt-5 flex items-center justify-between gap-4">
            {onPrevLesson ? (
              <button
                onClick={onPrevLesson}
                disabled={isFirstLesson}
                className="flex-1 py-2.5 px-4 rounded-xl border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                id="footer-prev-lesson-btn"
              >
                <span>← Previous Mission</span>
              </button>
            ) : <div />}
            {onNextLesson ? (
              <button
                onClick={onNextLesson}
                disabled={isLastLesson}
                className="flex-1 py-2.5 px-4 rounded-xl border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-xs font-mono font-bold transition-all flex items-center justify-center gap-2"
                id="footer-next-lesson-btn"
              >
                <span>Next Mission →</span>
              </button>
            ) : <div />}
          </div>

        </motion.div>

        {/* RIGHT COLUMN: Interactive Playground, Visualizer & Quizzes */}
        <AnimatePresence>
          {isDrawerOpen && (
            <motion.div
              initial={isMobile ? { opacity: 0 } : { x: '100%', opacity: 0 }}
              animate={{ width: isMobile ? '100%' : `${drawerWidth}%`, x: 0, opacity: 1 }}
              exit={isMobile ? { opacity: 0 } : { x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
              className="h-full bg-surface-bright flex flex-col justify-between overflow-hidden border-l border-outline-variant shrink-0"
              style={{ width: isMobile ? '100%' : `${drawerWidth}%` }}
            >
              {/* Tab Selector Buttons */}
              <div className="h-14 px-4 border-b border-outline-variant bg-surface-container-lowest flex items-center justify-between shrink-0 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRightTab('visualizer')}
                    className={`font-bold px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                      rightTab === 'visualizer' 
                        ? 'bg-surface-container-low text-primary border border-outline-variant/60' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Visualizer
                  </button>
                  <button
                    onClick={() => setRightTab('quiz')}
                    className={`font-bold px-2.5 py-1.5 rounded transition-all cursor-pointer ${
                      rightTab === 'quiz' 
                        ? 'bg-surface-container-low text-primary border border-outline-variant/60' 
                        : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    Quiz Deck
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Drawer Sizing Controls */}
                  <div className="hidden sm:flex items-center gap-2 border border-outline-variant rounded px-2 py-1 bg-surface-container-low select-none">
                    <span className="text-[9px] font-mono font-bold text-on-surface-variant uppercase">Width:</span>
                    <input 
                      type="range" 
                      min="30" 
                      max="85" 
                      value={drawerWidth} 
                      onChange={(e) => setDrawerWidth(Number(e.target.value))}
                      className="w-16 h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <span className="text-[9px] font-mono font-bold text-primary min-w-[24px] text-right">{drawerWidth}%</span>
                  </div>

                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-[10px] font-bold text-on-surface-variant hover:text-on-surface flex items-center gap-1 px-2 py-1 rounded border border-outline-variant hover:bg-surface-container-low cursor-pointer transition-all"
                    title="Collapse Workspace"
                  >
                    <span>Hide</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

              {/* Core Active Tab Panel Content */}
              <div className="flex-1 overflow-y-auto md:overflow-hidden p-3.5 sm:p-5" id="active-tab-content-container">
                
                {/* 1. VISUALIZER TAB */}
                {rightTab === 'visualizer' && (
                  <div className="flex flex-col gap-4 h-auto md:h-full md:overflow-hidden" id="visualizer-panel">
                    
                    {/* Live Compiler Shell (Unified Editor & Compilation Runner) */}
                    <div className="bg-[#11151C] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-inner shrink-0">
                      <div className="h-9 px-3 bg-slate-950 border-b border-slate-900 flex items-center justify-between font-mono text-[9px] text-slate-400">
                        <span className="font-bold uppercase tracking-wider">LIVE SQL COMPILER TERMINAL</span>
                        <div className="flex items-center gap-1.5">
                          {editorResult ? (
                            editorResult.success ? (
                              <span className="text-emerald-400 font-bold">✓ READY TO RUN</span>
                            ) : (
                              <span className="text-rose-400 font-bold">⚠️ SYNTAX ERROR</span>
                            )
                          ) : (
                            <span className="text-slate-500 font-bold">IDLE</span>
                          )}
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        </div>
                      </div>

                      <div className="relative">
                        <textarea
                          value={editorSql}
                          onChange={(e) => setEditorSql(e.target.value)}
                          className="w-full h-20 p-3 text-xs font-mono text-indigo-200 bg-[#11151C] border-none focus:outline-none focus:ring-0 leading-relaxed resize-none scrollbar-thin select-all"
                          placeholder="Type Oracle SQL here..."
                        />
                        <div className="absolute bottom-2 right-2 flex gap-1.5">
                          <button
                            onClick={() => setEditorSql(lesson.sql)}
                            className="px-2 py-1 border border-slate-800 text-slate-400 bg-slate-900 rounded font-bold font-mono text-[9px] hover:bg-slate-800 cursor-pointer"
                          >
                            Reset
                          </button>
                          <button
                            onClick={runCustomQuery}
                            className="bg-primary hover:bg-opacity-95 text-white font-bold font-mono text-[9px] uppercase tracking-wider px-3 py-1 rounded border border-primary shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Play size={10} fill="currentColor" />
                            <span>Compile & Run SQL</span>
                          </button>
                        </div>
                      </div>

                      {/* Suggestions list for fast typing */}
                      <div className="h-8 px-2 bg-slate-950 border-t border-slate-900 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                        <span className="text-[8px] font-mono font-bold text-slate-500 pr-1 select-none uppercase">Suggest:</span>
                        {['SELECT', 'FROM', 'WHERE', 'ORDER BY', 'DISTINCT', activeInputTable.table_name].map(keyword => (
                          <button
                            key={keyword}
                            onClick={() => setEditorSql(prev => prev.replace(/;$/, '') + ' ' + keyword + ';')}
                            className="bg-slate-900 hover:bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800 text-[8px] font-mono transition-colors font-bold shrink-0 cursor-pointer"
                          >
                            {keyword}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Compilation error panel if any */}
                    {editorResult && !editorResult.success && (
                      <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15 text-[10px] text-rose-600 font-mono shrink-0">
                        <span className="font-bold">Database Compiler Error:</span>
                        <p className="mt-0.5">{editorResult.error}</p>
                      </div>
                    )}

                    {/* Database Table & Output visualization splits */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:flex-1 md:overflow-hidden">
                      
                      {/* Left DB view (Input Table) */}
                      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col justify-between min-h-[280px] md:min-h-0 md:flex-1">
                        <div className="h-10 px-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Database size={13} className="text-primary" />
                            <span className="text-[10px] font-bold text-on-surface">INPUT: <span className="font-extrabold text-primary">{activeInputTable.table_name}</span></span>
                          </div>
                          <span className="text-[9px] text-on-surface-variant font-mono font-bold">{activeInputTable.rows.length} rows</span>
                        </div>

                        <div className="flex-1 overflow-auto p-3 scrollbar-thin">
                          <table className="w-full text-[10px] font-mono border-collapse">
                            <thead>
                              <tr className="border-b border-outline-variant text-left text-on-surface-variant">
                                {activeInputTable.columns.map((col) => (
                                  <th key={col} className="p-2 font-bold tracking-tight text-on-surface-variant">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {activeInputTable.rows.map((row, rIdx) => {
                                return (
                                  <tr key={rIdx} className="border-b border-outline-variant/30 hover:bg-surface-container-low/50 transition-all duration-200">
                                    {activeInputTable.columns.map((col) => (
                                      <td key={col} className="p-2 text-on-surface-variant">
                                        {String(row[col])}
                                      </td>
                                    ))}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Static connection status bar */}
                        <div className="h-10 px-3 bg-slate-900 border-t border-slate-800 flex items-center text-[10px] font-mono text-slate-400 justify-between">
                          <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Active Schema</span>
                          <span className="text-[9px] font-mono font-extrabold text-emerald-500">Oracle v19c DB Connected</span>
                        </div>
                      </div>

                      {/* Right DB View (Output Report) */}
                      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col min-h-[280px] md:min-h-0 md:flex-1">
                        <div className="h-10 px-3 bg-surface-container-low border-b border-outline-variant flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-mono">
                            <Terminal size={13} className="text-primary" />
                            <span className="text-[10px] font-bold text-on-surface">OUTPUT REPORT</span>
                          </div>
                          <span className="text-[8px] text-emerald-700 font-bold font-mono bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">REALTIME</span>
                        </div>

                        <div className="flex-1 p-3 overflow-auto scrollbar-thin">
                          {editorResult && editorResult.success && editorResult.rows.length > 0 ? (
                            <table className="w-full text-[10px] font-mono border-collapse">
                              <thead>
                                <tr className="border-b border-outline-variant text-left text-on-surface-variant">
                                  {editorResult.columns.map((col) => (
                                    <th key={col} className="p-2 font-bold tracking-tight text-on-surface-variant">{col}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {editorResult.rows.map((row, rIdx) => (
                                  <tr key={rIdx} className="border-b border-outline-variant/30 animate-in fade-in duration-200 hover:bg-surface-container-low/50">
                                    {editorResult.columns.map((col) => (
                                      <td key={col} className="p-2 text-on-surface font-medium">
                                        {String(row[col])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2">
                              <Database size={18} className="text-primary/60" />
                              <div className="space-y-0.5">
                                <p className="text-[11px] font-bold text-on-surface">No records loaded</p>
                                <p className="text-[10px] text-on-surface-variant max-w-xs font-serif italic">Compile and execute a valid SQL query to generate the report output.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                )}



                {/* 3. QUIZ DECK TAB */}
                {rightTab === 'quiz' && (
                  <div className="flex flex-col gap-4 h-auto md:h-full md:overflow-hidden text-left" id="quiz-deck-panel">
                    
                    <div className="flex gap-2 border-b border-outline-variant/60 pb-2 shrink-0">
                      {['mcq', 'tf', 'challenge'].map((sect) => {
                        const labelMap: Record<string, string> = {
                          mcq: 'MCQ (5)',
                          tf: 'True/False',
                          challenge: 'Challenge'
                        };
                        return (
                          <button
                            key={sect}
                            onClick={() => setQuizSection(sect as any)}
                            className={`text-[9px] font-mono font-bold uppercase px-2.5 py-1 rounded border transition-all cursor-pointer ${
                              quizSection === sect 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low'
                            }`}
                          >
                            {labelMap[sect]}
                          </button>
                        );
                      })}
                    </div>

                    {/* Tab content viewer */}
                    <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-4">
                      
                      {/* MCQ Section */}
                      {quizSection === 'mcq' && (
                        <div className="space-y-4">
                          {lesson.quiz.mcq.map((q, idx) => {
                            const submittedVal = mcqAnswers[idx];
                            const isCorrect = submittedVal === q.correct_answer;
                            return (
                              <div key={idx} className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3">
                                <p className="font-bold text-xs text-on-surface">
                                  {idx + 1}. {q.question}
                                </p>
                                <div className="grid grid-cols-1 gap-2 text-xs">
                                  {q.options.map((opt) => {
                                    const isSelected = submittedVal === opt;
                                    const isOptCorrect = opt === q.correct_answer;
                                    
                                    let optClass = 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant';
                                    if (isSelected) {
                                      optClass = isCorrect 
                                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-800' 
                                        : 'bg-rose-500/10 border-rose-400 text-rose-800';
                                    } else if (submittedVal && isOptCorrect) {
                                      optClass = 'bg-emerald-500/5 border-emerald-300 text-emerald-700';
                                    }

                                    return (
                                      <button
                                        key={opt}
                                        disabled={!!submittedVal}
                                        onClick={() => handleMcqSelect(idx, opt)}
                                        className={`p-2.5 rounded-lg border text-left text-[11px] font-medium transition-all cursor-pointer ${optClass}`}
                                      >
                                        {opt}
                                      </button>
                                    );
                                  })}
                                </div>

                                {submittedVal && (
                                  <div className={`p-3 rounded-lg border flex gap-2 text-[11px] leading-relaxed ${
                                    isCorrect 
                                      ? 'bg-emerald-500/5 border-emerald-200/50 text-emerald-800' 
                                      : 'bg-rose-500/5 border-rose-200/50 text-rose-800'
                                  }`}>
                                    <div className="font-serif">
                                      <span className="font-mono font-bold uppercase text-[9px] block mb-0.5">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                                      <p>{q.explanation}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* True False Section */}
                      {quizSection === 'tf' && (
                        <div className="space-y-4">
                          {lesson.quiz.true_false.map((q, idx) => {
                            const submittedVal = tfAnswers[idx];
                            const isCorrect = submittedVal === q.answer;
                            return (
                              <div key={idx} className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-3">
                                <p className="font-bold text-xs text-on-surface">
                                  {idx + 1}. {q.statement}
                                </p>
                                <div className="flex gap-2 text-xs">
                                  {[true, false].map((opt) => {
                                    const isSelected = submittedVal === opt;
                                    const isOptCorrect = opt === q.answer;

                                    let optClass = 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant';
                                    if (isSelected) {
                                      optClass = isCorrect 
                                        ? 'bg-emerald-500/10 border-emerald-400 text-emerald-800' 
                                        : 'bg-rose-500/10 border-rose-400 text-rose-800';
                                    } else if (submittedVal !== undefined && isOptCorrect) {
                                      optClass = 'bg-emerald-500/5 border-emerald-300 text-emerald-700';
                                    }

                                    return (
                                      <button
                                        key={String(opt)}
                                        disabled={submittedVal !== undefined}
                                        onClick={() => handleTfSelect(idx, opt)}
                                        className={`px-4 py-2 rounded-lg border font-mono font-bold w-20 transition-all cursor-pointer text-[10px] ${optClass}`}
                                      >
                                        {opt ? 'TRUE' : 'FALSE'}
                                      </button>
                                    );
                                  })}
                                </div>

                                {submittedVal !== undefined && (
                                  <div className={`p-3 rounded-lg border flex gap-2 text-[11px] leading-relaxed ${
                                    isCorrect 
                                      ? 'bg-emerald-500/5 border-emerald-200/50 text-emerald-800' 
                                      : 'bg-rose-500/5 border-rose-200/50 text-rose-800'
                                  }`}>
                                    <div className="font-serif">
                                      <span className="font-mono font-bold uppercase text-[9px] block mb-0.5">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
                                      <p>{q.explanation}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Coding Challenge section */}
                      {quizSection === 'challenge' && (
                        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant space-y-4">
                          <div className="space-y-1">
                            <span className="text-[9px] font-mono font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded border border-outline-variant/30 uppercase tracking-wider">Active Query Mission</span>
                            <h4 className="text-sm font-bold text-on-surface font-sans pt-1">Compile the Expected Output</h4>
                            <p className="text-xs text-on-surface-variant font-serif leading-relaxed mt-1">
                              {lesson.coding_challenge.prompt}
                            </p>
                          </div>

                          <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant text-[11px] font-mono leading-relaxed select-all">
                            <span className="font-bold text-on-surface uppercase text-[9px] tracking-wide block mb-1">Expected Query Solution:</span>
                            <code className="text-primary font-bold">{lesson.expected_answer}</code>
                          </div>

                          <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant text-[11px] font-serif italic text-on-surface-variant space-y-1">
                            <span className="font-sans font-bold text-[9px] text-on-surface block uppercase not-italic tracking-wide">How to solve:</span>
                            <p>1. Type your query solution in the Live SQL Compiler on the <span className="font-bold text-primary cursor-pointer underline font-sans" onClick={() => setRightTab('visualizer')}>Visualizer</span> tab.</p>
                            <p>2. Click <span className="font-sans font-bold">Compile SQL</span> to run it and verify the output.</p>
                          </div>

                          {codeChallengePassed ? (
                            <div className="p-3 rounded-lg border border-emerald-400 bg-emerald-500/5 flex gap-2 text-[11px] leading-relaxed text-emerald-800">
                              <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                              <div>
                                <span className="font-mono font-bold uppercase text-[9px] block">Challenge Complete!</span>
                                <p className="font-serif">Terrific job! The query output matches the target schemas perfectly.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg border border-outline-variant bg-surface-container-low flex gap-2 text-[11px] leading-relaxed text-on-surface-variant font-serif italic">
                              <Lightbulb size={15} className="shrink-0 text-on-surface-variant" />
                              <p>Run query in Live SQL Compiler on the Visualizer tab to complete the challenge.</p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>

                  </div>
                )}

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-inverse-surface text-inverse-on-surface border border-outline rounded-xl px-5 py-3 shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs font-mono font-bold">{toast}</span>
        </div>
      )}

      </div>
    </div>
  );
}
