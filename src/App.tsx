import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CourseMap from "./components/CourseMap";
import LessonView from "./components/LessonView";
import Playground from "./components/Playground";
import Flashcards from "./components/Flashcards";
import Leaderboard from "./components/Leaderboard";
import { UserStats } from "./types";
import { LESSONS } from "./data/lessons";
import { generateAnonymousUser } from "./utils/userGenerator";
import {
  Sparkles,
  Award,
  X,
  Check,
  ArrowRight,
  Map,
  Terminal,
  BookOpen,
  User,
  Sun,
  Moon,
  Trophy,
  Menu,
  Database,
  Code,
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return localStorage.getItem("sql_academy_current_tab") || "course-map";
  });
  const [activeLessonId, setActiveLessonId] = useState<string | null>(() => {
    return localStorage.getItem("sql_academy_active_lesson_id") || null;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Sync currentTab to local storage
  useEffect(() => {
    localStorage.setItem("sql_academy_current_tab", currentTab);
  }, [currentTab]);

  // Sync activeLessonId to local storage
  useEffect(() => {
    if (activeLessonId) {
      localStorage.setItem("sql_academy_active_lesson_id", activeLessonId);
    } else {
      localStorage.removeItem("sql_academy_active_lesson_id");
    }
  }, [activeLessonId]);

  // Three-state premium theme engine
  const [theme, setTheme] = useState<"light" | "dark" | "terminal">(() => {
    return (localStorage.getItem("sql_academy_theme") as any) || "light";
  });

  // Experience level milestone popups
  const [showLevelUp, setShowLevelUp] = useState<boolean>(false);
  const [showXpGain, setShowXpGained] = useState<number | null>(null);

  // Initialize stats with clean starter values so a new user starts at Level 1 with 0 XP
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem("sql_academy_stats");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.userId || !parsed.username) {
          const generated = generateAnonymousUser();
          parsed.userId = parsed.userId || generated.userId;
          parsed.username = parsed.username || generated.username;
        }
        // Force reset to level 1 and 0 XP if they have not completed any lessons yet to ensure clean onboarding
        if (!parsed.completedLessons || parsed.completedLessons.length === 0) {
          parsed.xp = 0;
          parsed.level = 1;
          parsed.streak = 1;
        }
        return parsed;
      } catch (e) {
        console.error("Could not parse stats", e);
      }
    }
    const generated = generateAnonymousUser();
    return {
      xp: 0,
      level: 1,
      streak: 1,
      lastActive: new Date().toISOString(),
      completedLessons: [],
      unlockedPhases: ["phase_1"],
      badges: [],
      notes: {},
      bookmarks: [],
      userId: generated.userId,
      username: generated.username,
      hasFreeBonusXP: true,
    };
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("sql_academy_stats", JSON.stringify(stats));
  }, [stats]);

  // Sync theme class on document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark", "theme-terminal");
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "terminal") {
      root.classList.add("theme-terminal");
    }
    localStorage.setItem("sql_academy_theme", theme);
  }, [theme]);

  // Handle lesson completion & XP gains
  const handleLessonCompleted = (lessonId: string, xpGained: number) => {
    setStats((prev) => {
      // Check if already completed to avoid duplicate XP
      const alreadyCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = alreadyCompleted
        ? prev.completedLessons
        : [...prev.completedLessons, lessonId];

      const newXp = alreadyCompleted ? prev.xp : prev.xp + xpGained;

      // Every 100 XP is a level
      const currentLevelBenchmark = Math.floor(prev.xp / 100);
      const newLevelBenchmark = Math.floor(newXp / 100);
      const newLevel =
        newLevelBenchmark > currentLevelBenchmark ? prev.level + 1 : prev.level;

      if (newLevel > prev.level) {
        setShowLevelUp(true);
      }

      if (!alreadyCompleted) {
        setShowXpGained(xpGained);
        setTimeout(() => setShowXpGained(null), 3000);
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        completedLessons: newCompleted,
      };
    });

    // Automatically redirect to the next lesson/level on first completion
    const currentIndex = LESSONS.findIndex((l) => l.id === lessonId);
    const nextLesson = LESSONS[currentIndex + 1];
    if (nextLesson) {
      setTimeout(() => {
        setActiveLessonId(nextLesson.id);
      }, 1500);
    } else {
      setTimeout(() => {
        setActiveLessonId(null);
      }, 1500);
    }
  };

  const handleSaveNotes = (lessonId: string, text: string) => {
    setStats((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [lessonId]: text,
      },
    }));
  };

  const handleToggleBookmark = (lessonId: string) => {
    setStats((prev) => {
      const alreadyBookmarked = prev.bookmarks.includes(lessonId);
      return {
        ...prev,
        bookmarks: alreadyBookmarked
          ? prev.bookmarks.filter((id) => id !== lessonId)
          : [...prev.bookmarks, lessonId],
      };
    });
  };

  const handleNextLesson = () => {
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLessonId);
    const nextLesson = LESSONS[currentIndex + 1];
    if (nextLesson) {
      setActiveLessonId(nextLesson.id);
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLessonId);
    const prevLesson = LESSONS[currentIndex - 1];
    if (prevLesson) {
      setActiveLessonId(prevLesson.id);
    }
  };

  const handleUnlockPhase = (phaseId: string, cost: number) => {
    setStats((prev) => {
      if (prev.xp < cost) return prev;
      if (prev.unlockedPhases.includes(phaseId)) return prev;
      return {
        ...prev,
        xp: prev.xp - cost,
        unlockedPhases: [...prev.unlockedPhases, phaseId],
      };
    });
  };

  // Find active lesson object
  const activeLesson = LESSONS.find((l) => l.id === activeLessonId);

  return (
    <div className="h-screen w-screen bg-background text-on-surface transition-colors duration-200 overflow-hidden font-sans flex flex-col">
      {/* TopAppBar Component */}
      {!activeLessonId && (
        <header className="w-full top-0 sticky z-45 bg-surface-container-lowest border-b border-outline-variant shrink-0">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div
              onClick={() => {
                setCurrentTab("course-map");
                setActiveLessonId(null);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 cursor-pointer active:opacity-80"
            >
              <Database className="text-primary w-5 h-5" />
              <span className="text-lg font-black tracking-tight text-primary font-sans select-none">
                SQL_LAB
              </span>
            </div>

            {/* Desktop Central Navigation Bar */}
            <nav className="hidden md:flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
              {[
                { id: "course-map", label: "Path" },
                { id: "playground", label: "Workbench" },
                { id: "flashcards", label: "Cards" },
              ].map((tab) => {
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCurrentTab(tab.id);
                      setActiveLessonId(null);
                    }}
                    className={`relative px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider font-sans transition-colors duration-250 cursor-pointer z-10 ${
                      isActive
                        ? "text-white"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-nav-tab"
                        className="absolute inset-0 bg-primary rounded-full -z-10 shadow-sm"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Desktop Quick Controls */}
            <div className="hidden md:flex items-center gap-4">
              {/* Multi-Theme Cycle button */}
              <button
                onClick={() => {
                  setTheme((prev) => {
                    if (prev === "light") return "dark";
                    if (prev === "dark") return "terminal";
                    return "light";
                  });
                }}
                className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-all cursor-pointer flex items-center gap-1.5 font-mono text-[10px] font-bold"
                title="Change Aesthetic Theme"
              >
                {theme === "light" && (
                  <>
                    <Sun
                      className="w-3.5 h-3.5 text-amber-500 animate-spin"
                      style={{ animationDuration: "8s" }}
                    />
                    <span>Light</span>
                  </>
                )}
                {theme === "dark" && (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Dark</span>
                  </>
                )}
                {theme === "terminal" && (
                  <>
                    <Terminal className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="text-emerald-500 font-extrabold uppercase tracking-wider">
                      Terminal
                    </span>
                  </>
                )}
              </button>

              {/* Level & XP Capsule Badge */}
              <div className="text-primary text-[11px] font-extrabold font-mono bg-primary-fixed px-3.5 py-1.5 rounded-full select-none">
                Lvl {stats.level} • {stats.xp.toLocaleString()} XP
              </div>
            </div>

            {/* Mobile Navigation Toggle (Hamburger Icon) */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container transition-all cursor-pointer flex items-center justify-center"
                aria-label="Toggle Navigation Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </header>
      )}

      {/* Mobile Menu Side-drawer panel */}
      <AnimatePresence>
        {isMobileMenuOpen && !activeLessonId && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
            />

            {/* Drawer sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-[280px] bg-surface-container-lowest border-l border-outline-variant z-50 p-5 flex flex-col justify-between shadow-2xl md:hidden"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant">
                  <div className="flex items-center gap-2">
                    <Database className="text-primary w-5 h-5" />
                    <span className="text-base font-black tracking-tight text-primary font-sans select-none">
                      SQL_LAB
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vertical menu navigation */}
                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      setCurrentTab("course-map");
                      setActiveLessonId(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider font-sans transition-all flex items-center gap-3 cursor-pointer ${
                      currentTab === "course-map"
                        ? "bg-primary text-white shadow-md"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <Map className="w-4 h-4" />
                    <span>Path</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab("playground");
                      setActiveLessonId(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider font-sans transition-all flex items-center gap-3 cursor-pointer ${
                      currentTab === "playground"
                        ? "bg-primary text-white shadow-md"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>Workbench</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab("flashcards");
                      setActiveLessonId(null);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider font-sans transition-all flex items-center gap-3 cursor-pointer ${
                      currentTab === "flashcards"
                        ? "bg-primary text-white shadow-md"
                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Cards</span>
                  </button>
                </div>
              </div>

              {/* Mobile Drawer Footer with Stats & Theme toggle */}
              <div className="border-t border-outline-variant pt-5 space-y-4">
                <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4.5 h-4.5 text-primary" />
                    <span className="text-xs font-bold text-on-surface">
                      Lvl {stats.level}
                    </span>
                  </div>
                  <span className="text-[11px] font-extrabold font-mono text-primary bg-primary-fixed px-2.5 py-1 rounded-full">
                    {stats.xp.toLocaleString()} XP
                  </span>
                </div>

                <button
                  onClick={() => {
                    setTheme((prev) => {
                      if (prev === "light") return "dark";
                      if (prev === "dark") return "terminal";
                      return "light";
                    });
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-all cursor-pointer flex items-center justify-between font-mono text-[11px] font-bold"
                >
                  <span className="text-on-surface-variant font-sans font-semibold">
                    Aesthetic
                  </span>
                  <div className="flex items-center gap-1.5">
                    {theme === "light" && (
                      <>
                        <Sun
                          className="w-3.5 h-3.5 text-amber-500 animate-spin"
                          style={{ animationDuration: "8s" }}
                        />
                        <span>Light</span>
                      </>
                    )}
                    {theme === "dark" && (
                      <>
                        <Moon className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Dark</span>
                      </>
                    )}
                    {theme === "terminal" && (
                      <>
                        <Terminal className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        <span className="text-emerald-500 font-extrabold uppercase tracking-wider">
                          Terminal
                        </span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main content body */}
      <main className="flex-1 w-full overflow-y-auto relative bg-surface-bright">
        {/* Render active interactive lesson view or normal tab content */}
        {activeLessonId && activeLesson ? (
          <div className="fixed inset-0 z-40 bg-background pt-0">
            <LessonView
              lesson={activeLesson}
              userStats={stats}
              onLessonCompleted={handleLessonCompleted}
              onClose={() => setActiveLessonId(null)}
              onSaveNotes={handleSaveNotes}
              onToggleBookmark={handleToggleBookmark}
              theme={theme}
              setTheme={setTheme}
              onNextLesson={handleNextLesson}
              onPrevLesson={handlePrevLesson}
            />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className={`mx-auto ${
                currentTab === "playground"
                  ? "max-w-7xl px-4 md:px-6 py-6"
                  : "max-w-[720px] px-4 md:px-0 py-6"
              }`}
            >
              {currentTab === "course-map" && (
                <CourseMap
                  userStats={stats}
                  onStartLesson={(lessonId) => setActiveLessonId(lessonId)}
                  onUnlockPhase={handleUnlockPhase}
                />
              )}

              {currentTab === "flashcards" && <Flashcards />}

              {currentTab === "playground" && <Playground />}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Floating XP Gain splash indicator popup */}
        {showXpGain !== null && (
          <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-white rounded-2xl px-5 py-3 shadow-2xl flex items-center gap-3 animate-bounce z-50">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-[10px]">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <span className="text-xs font-black tracking-wide font-mono">
              +{showXpGain} XP AWARDED!
            </span>
          </div>
        )}

        {/* Level Up Celebration Splash Screen Dialog */}
        {showLevelUp && (
          <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center relative shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <button
                onClick={() => setShowLevelUp(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-850 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-20 h-20 mx-auto rounded-full bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 animate-pulse">
                <Award className="w-12 h-12" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full">
                  Level Reached!
                </span>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 pt-1.5 font-sans">
                  Level {stats.level} Scholar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-serif">
                  Congratulations! You earned enough expertise points (XP) to
                  climb. Your rank is expanding, keep up the outstanding pace!
                </p>
              </div>

              <button
                onClick={() => setShowLevelUp(false)}
                className="w-full py-3.5 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-indigo-100 dark:hover:shadow-none transition-all flex items-center justify-center gap-1.5"
              >
                <span>Awesome! Continue Path</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
