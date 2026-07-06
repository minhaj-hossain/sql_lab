import React, { useState } from "react";
import { LESSONS, PHASES } from "../data/lessons";
import { Lesson, UserStats } from "../types";
import {
  Play,
  Check,
  Lock,
  Map,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  X,
  Award,
  Terminal,
  Compass,
} from "lucide-react";

interface CourseMapProps {
  userStats: UserStats;
  onStartLesson: (lessonId: string) => void;
  onUnlockPhase: (phaseId: string, cost: number) => void;
}

export default function CourseMap({
  userStats,
  onStartLesson,
  onUnlockPhase,
}: CourseMapProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [confirmUnlock, setConfirmUnlock] = useState<{
    phaseId: string;
    cost: number;
    name: string;
  } | null>(null);

  const completedLessons = userStats.completedLessons;

  // Group lessons dynamically into Phase 1, Phase 2, Phase 3
  const phase1Lessons = LESSONS.filter((l) => l.phase === "phase_1");
  const phase2Lessons = LESSONS.filter((l) => l.phase === "phase_2");
  const phase3Lessons = LESSONS.filter((l) => l.phase === "phase_3");

  const isPhase1Completed = phase1Lessons.every((l) =>
    completedLessons.includes(l.id),
  );
  const isPhase2Completed =
    phase2Lessons.length > 0 &&
    phase2Lessons.every((l) => completedLessons.includes(l.id));

  // Determine if phases are unlocked either via completed preceding phase OR explicitly unlocked with XP
  const isPhase2Unlocked =
    userStats.unlockedPhases.includes("phase_2") || isPhase1Completed;
  const isPhase3Unlocked =
    userStats.unlockedPhases.includes("phase_3") || isPhase2Completed;

  const phases = [
    {
      id: "phase_1",
      name: "Phase 1: SQL & Analytic Querying",
      status: isPhase1Completed ? "Completed" : "Current",
      lessons: phase1Lessons,
      cost: 0,
    },
    {
      id: "phase_2",
      name: "Phase 2: PL/SQL Procedural Blocks",
      status: isPhase2Completed
        ? "Completed"
        : isPhase2Unlocked
          ? "Current"
          : "Locked",
      lessons: phase2Lessons,
      cost: 100,
    },
    {
      id: "phase_3",
      name: "Phase 3: Advanced Database & Tuning",
      status: isPhase2Completed
        ? phase3Lessons.every((l) => completedLessons.includes(l.id))
          ? "Completed"
          : "Current"
        : isPhase3Unlocked
          ? "Current"
          : "Locked",
      lessons: phase3Lessons,
      cost: 200,
    },
  ];

  // Helper to determine if a lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson) => {
    const isPhaseUnlocked =
      lesson.phase === "phase_1" ||
      (lesson.phase === "phase_2" && isPhase2Unlocked) ||
      (lesson.phase === "phase_3" && isPhase3Unlocked);

    if (!isPhaseUnlocked) return false;

    // Sequential within its phase
    const phaseLessons = LESSONS.filter((l) => l.phase === lesson.phase);
    const idxInPhase = phaseLessons.findIndex((l) => l.id === lesson.id);
    if (idxInPhase === 0) return true; // first lesson of phase is immediately open
    const previousLesson = phaseLessons[idxInPhase - 1];
    return completedLessons.includes(previousLesson.id);
  };

  // Calculate course map progress dynamically based on total course lessons
  const progressPercent = Math.round(
    (completedLessons.length / LESSONS.length) * 100,
  );

  return (
    <div
      className="space-y-8 animate-in fade-in duration-300 max-w-[640px] mx-auto pt-6 pb-24"
      id="course-map-view"
    >
      {/* Header Section */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono font-extrabold text-primary uppercase tracking-widest mb-1.5">
              Current Track
            </p>
            <h1 className="text-3xl font-black tracking-tight text-on-surface">
              Learning Path
            </h1>
          </div>
          <div className="flex flex-col items-start md:items-end shrink-0">
            <span className="text-xs font-mono font-bold text-on-surface-variant mb-1">
              {progressPercent}% Completed
            </span>
            <div className="w-48 h-1.5 bg-slate-200 dark:bg-zinc-850 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Phases Timeline */}
      <div className="space-y-8">
        {phases.map((phase) => {
          const isCompleted = phase.status === "Completed";
          const isCurrent = phase.status === "Current";
          const isLocked = phase.status === "Locked";

          return (
            <div key={phase.id} className="space-y-4">
              {/* Phase Divider Header */}
              <div className="flex items-center gap-4 py-3">
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-zinc-800"></div>
                <span
                  className={`text-[10px] font-black font-mono uppercase tracking-widest px-2.5 py-1 rounded-md ${
                    isCompleted
                      ? "text-emerald-600 bg-emerald-500/10"
                      : isCurrent
                        ? "text-primary bg-primary-fixed"
                        : "text-on-surface-variant/60 bg-surface-container border border-outline-variant/30"
                  }`}
                >
                  {phase.name} • {phase.status}
                </span>
                <div className="h-[1px] flex-1 bg-slate-200 dark:bg-zinc-800"></div>
              </div>

              {/* Lesson Cards under this Phase */}
              <div className="space-y-4 relative">
                {/* Visual Connector Timeline Track */}
                {!isLocked && phase.lessons.length > 1 && (
                  <div className="absolute left-6 top-6 bottom-6 w-[1px] bg-slate-200 dark:bg-zinc-800 z-0"></div>
                )}

                {isLocked && (
                  <div className="absolute inset-0 bg-surface-bright/80 dark:bg-zinc-950/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-outline-variant/70 animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2.5">
                      <Lock
                        className="w-5 h-5 animate-bounce"
                        style={{ animationDuration: "3s" }}
                      />
                    </div>
                    <h4 className="text-sm font-black text-on-surface uppercase tracking-wider font-sans">
                      Module Locked
                    </h4>
                    <p className="text-xs text-on-surface-variant font-mono max-w-xs mt-1 leading-relaxed">
                      This chapter is locked. Finish the previous phase or
                      unlock it instantly using experience points.
                    </p>

                    <div className="mt-4">
                      {userStats.xp >= phase.cost ? (
                        <button
                          onClick={() =>
                            setConfirmUnlock({
                              phaseId: phase.id,
                              cost: phase.cost,
                              name: phase.name,
                            })
                          }
                          className="px-4 py-2.5 bg-primary hover:bg-primary/95 text-white font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg shadow-md hover:shadow-primary/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>Unlock with {phase.cost} XP</span>
                        </button>
                      ) : (
                        <div className="flex flex-col items-center gap-1">
                          <button
                            disabled
                            className="px-4 py-2.5 bg-surface-container border border-outline-variant text-on-surface-variant/40 font-mono font-bold text-[10px] uppercase tracking-wider rounded-lg flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            <span>Unlock Costs {phase.cost} XP</span>
                          </button>
                          <span className="text-[9px] text-on-surface-variant/70 font-mono">
                            You need {phase.cost - userStats.xp} more XP
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {phase.lessons.map((lesson) => {
                  const done = completedLessons.includes(lesson.id);
                  const unlocked = isLessonUnlocked(lesson);
                  const active = unlocked && !done;

                  if (isLocked || !unlocked) {
                    // Locked Lesson Layout
                    return (
                      <div
                        key={lesson.id}
                        className="p-4 rounded-xl flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-200/50 dark:border-zinc-800/50 opacity-40 grayscale select-none"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-mono font-bold text-on-surface-variant/70">
                              LESSON {lesson.lesson_number} •{" "}
                              {lesson.query_type.toUpperCase()}
                            </p>
                            <h3 className="text-sm font-bold text-on-surface truncate pr-2">
                              {lesson.title}
                            </h3>
                          </div>
                        </div>
                        <div className="shrink-0 p-2 text-on-surface-variant opacity-60">
                          <Lock className="w-4 h-4" />
                        </div>
                      </div>
                    );
                  }

                  if (active) {
                    // Active/Current Lesson Card Layout (Priceless polish, gorgeous expand)
                    return (
                      <div
                        key={lesson.id}
                        className="relative z-10 flex items-start gap-4 pb-2 mt-2"
                      >
                        {/* Timeline Circle */}
                        <div className="relative z-10 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary text-on-primary rounded-full shadow-lg shadow-primary-container/20 ring-4 ring-background animate-pulse">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>

                        {/* Grand Card Body */}
                        <div className="flex-grow bg-white dark:bg-zinc-900 border border-primary/25 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-mono text-[10px] rounded-full w-fit tracking-wider font-extrabold">
                              UNLOCKED
                            </span>
                            <span className="flex items-center gap-1 text-on-surface-variant/75 text-[10px] font-mono font-bold">
                              DIFFICULTY • {lesson.difficulty.toUpperCase()}
                            </span>
                          </div>

                          <h2 className="text-lg font-black text-on-surface mb-1.5 leading-tight animate-in fade-in slide-in-from-left-2">
                            Lesson {lesson.lesson_number} • {lesson.title}
                          </h2>
                          <p className="text-xs text-on-surface-variant mb-5 leading-relaxed">
                            {lesson.short_description}
                          </p>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => onStartLesson(lesson.id)}
                              className="bg-primary text-on-primary px-5 py-2 rounded-xl font-bold text-xs hover:bg-primary/95 active:scale-95 transition-all shadow-md shadow-primary/10 flex items-center gap-1.5 cursor-pointer"
                              id={`start-lesson-btn-${lesson.id}`}
                            >
                              <span>Start Mission</span>
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Completed/Review/Open Lesson Layout (Slick, compact, checked)
                  return (
                    <div
                      key={lesson.id}
                      className="relative z-10 flex items-start gap-4 pb-2"
                    >
                      {/* Checked Circle */}
                      <div className="relative z-10 w-12 h-12 flex-shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                        <Check className="w-5 h-5" strokeWidth={3} />
                      </div>

                      {/* Content Row */}
                      <div className="flex-grow pt-1.5 flex items-center justify-between gap-4 min-w-0">
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-on-surface-variant/60 line-through truncate pr-2">
                            Lesson {lesson.lesson_number} • {lesson.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant/40 font-mono truncate">
                            {lesson.short_description}
                          </p>
                        </div>

                        <button
                          onClick={() => onStartLesson(lesson.id)}
                          className="px-4 py-1.5 border border-outline-variant hover:bg-surface-container rounded-lg text-on-surface font-bold text-xs hover:text-primary transition-colors active:scale-95 duration-100 cursor-pointer shrink-0"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Decorative Bottom Spotlight and Rewards row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-outline-variant/60">
        {/* Developer Spotlight Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4.5 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-primary">
            <Compass className="w-4 h-4" />
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider">
              Developer Spotlight
            </span>
          </div>
          <p className="text-xs text-on-surface leading-relaxed">
            Our graduates are executing production-grade SELECT statements at
            companies like <span className="font-sans font-bold">Oracle</span>,{" "}
            <span className="font-sans font-bold">Amazon</span>, and{" "}
            <span className="font-sans font-bold">IBM</span>. Complete filtering
            block next!
          </p>
        </div>

        {/* Upcoming Reward Card */}
        <div className="bg-surface-container-lowest border border-outline-variant p-4.5 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-on-surface-variant block uppercase tracking-wide">
              Upcoming Reward
            </span>
            <h4 className="text-sm font-bold text-on-surface">
              Filter Graduate Badge
            </h4>
            <p className="text-[11px] text-primary italic font-semibold">
              Unlock at 300 XP milestone
            </p>
          </div>
        </div>
      </div>

      {/* Confirm Unlock Modal */}
      {confirmUnlock && (
        <div className="fixed inset-0 bg-slate-900/45 dark:bg-black/75 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-surface-bright border border-outline-variant p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-on-surface">
                Unlock Module?
              </h3>
              <p className="text-xs text-on-surface-variant font-serif italic leading-relaxed">
                Are you sure you want to spend{" "}
                <span className="font-mono font-bold text-primary">
                  {confirmUnlock.cost} XP
                </span>{" "}
                to instantly unlock{" "}
                <span className="font-sans font-bold">
                  {confirmUnlock.name}
                </span>
                ?
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setConfirmUnlock(null)}
                className="flex-1 py-2.5 border border-outline-variant hover:bg-surface-container rounded-lg text-xs font-mono font-bold text-on-surface-variant cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUnlockPhase(confirmUnlock.phaseId, confirmUnlock.cost);
                  setConfirmUnlock(null);
                }}
                className="flex-1 py-2.5 bg-primary hover:bg-opacity-95 text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-all shadow-sm"
              >
                Confirm Unlock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
