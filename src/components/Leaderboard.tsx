import React from 'react';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  Award
} from 'lucide-react';

interface LeaderboardUser {
  rank: number;
  name: string;
  level: number;
  xp: number;
  streak: number;
  badge: string;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  currentXp: number;
  currentStreak: number;
  currentLevel: number;
  username: string;
}

export default function Leaderboard({
  currentXp,
  currentStreak,
  currentLevel,
  username
}: LeaderboardProps) {
  // Mock listing, merging current user dynamic state at rank #4
  const competitors: LeaderboardUser[] = [
    { rank: 1, name: "Steven King (PL/SQL Architect)", level: 42, xp: 4200, streak: 31, badge: "Grandmaster" },
    { rank: 2, name: "Oracle_Oracle_Oracle", level: 28, xp: 2840, streak: 18, badge: "Master" },
    { rank: 3, name: "SQL_Witch_88", level: 19, xp: 1950, streak: 12, badge: "Pro" },
    { rank: 4, name: `${username} (You)`, level: currentLevel, xp: currentXp, streak: currentStreak, badge: "Apprentice", isCurrentUser: true },
    { rank: 5, name: "Neena Kochhar", level: 10, xp: 950, streak: 5, badge: "Novice" },
    { rank: 6, name: "Lex De Haan", level: 8, xp: 820, streak: 4, badge: "Novice" },
    { rank: 7, name: "David Austin", level: 6, xp: 580, streak: 3, badge: "Beginner" },
    { rank: 8, name: "Bruce Ernst", level: 4, xp: 380, streak: 2, badge: "Beginner" }
  ];

  // Sort list dynamically by XP
  competitors.sort((a, b) => b.xp - a.xp);

  // Re-map ranks after sort
  const sortedCompetitors = competitors.map((c, idx) => ({
    ...c,
    rank: idx + 1
  }));

  const userRank = sortedCompetitors.find(c => c.isCurrentUser)?.rank || 4;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-[640px] mx-auto pt-6 pb-24" id="leaderboard-view">
      
      {/* Visual Header */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Leaderboard Arena</h1>
        <p className="text-sm text-on-surface-variant font-serif italic">
          Compare your total experience (XP) and day streaks against simulated database learners.
        </p>
      </div>

      {/* User Rank Capsule banner */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-on-surface">Your Current Standing</span>
        </div>
        <span className="text-xs font-mono font-black text-primary bg-primary-fixed px-3 py-1 rounded-full border border-outline-variant/30">
          Rank #{userRank} overall
        </span>
      </div>

      {/* Main Leaderboard Panel */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm" id="leaderboard-panel-frame">
        
        {/* Table header */}
        <div className="h-10 px-4 bg-surface-container-low border-b border-outline-variant flex items-center justify-between text-[10px] font-mono font-bold text-on-surface-variant tracking-wider">
          <div className="flex items-center gap-6">
            <span className="w-8 text-center">RANK</span>
            <span>LEARNER NAME</span>
          </div>
          <div className="flex items-center gap-10 pr-2">
            <span className="w-12 text-center">STREAK</span>
            <span className="w-14 text-right">TOTAL XP</span>
          </div>
        </div>

        {/* Competitor list */}
        <div className="divide-y divide-outline-variant/60">
          {sortedCompetitors.map((comp) => {
            const isTop3 = comp.rank <= 3;
            const isCurrentUser = comp.isCurrentUser;

            let rowClass = 'hover:bg-surface-container-low/30';
            if (isCurrentUser) {
              rowClass = 'bg-primary-fixed border-l-4 border-primary relative z-10';
            }

            return (
              <div 
                key={comp.name} 
                className={`px-4 py-3 flex items-center justify-between transition-all duration-150 ${rowClass}`}
              >
                {/* Left block */}
                <div className="flex items-center gap-4 min-w-0">
                  {/* Rank identifier */}
                  <div className="w-8 h-8 rounded flex items-center justify-center font-mono font-black text-xs shrink-0 text-on-surface-variant">
                    {comp.rank === 1 ? (
                      <Trophy className="w-5 h-5 text-amber-500" />
                    ) : comp.rank === 2 ? (
                      <Trophy className="w-4.5 h-4.5 text-slate-400" />
                    ) : comp.rank === 3 ? (
                      <Trophy className="w-4 h-4 text-amber-700" />
                    ) : (
                      <span>{comp.rank}</span>
                    )}
                  </div>

                  {/* Identity profile */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-8 h-8 rounded border flex items-center justify-center font-mono font-black text-[10px] shrink-0 ${
                      isCurrentUser 
                        ? 'bg-primary text-white border-primary shadow-sm' 
                        : isTop3 
                          ? 'bg-surface-container text-on-surface border-outline-variant' 
                          : 'bg-surface-container-low text-on-surface-variant border-outline-variant/50'
                    }`}>
                      {comp.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-xs font-bold truncate ${isCurrentUser ? 'text-primary' : 'text-on-surface'}`}>
                          {comp.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[8px] bg-primary text-white uppercase px-1 rounded font-mono font-bold shrink-0">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] font-mono font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                        Level {comp.level} • {comp.badge}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right block */}
                <div className="flex items-center gap-10 pr-2 shrink-0">
                  {/* Streak */}
                  <div className="w-12 flex justify-center">
                    <div className="flex items-center gap-0.5 text-[10px] font-mono font-bold text-amber-600 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <Flame className="w-3 h-3" />
                      <span>{comp.streak}d</span>
                    </div>
                  </div>

                  {/* Total XP score */}
                  <div className="w-14 text-right font-mono text-xs font-bold text-on-surface">
                    {comp.xp.toLocaleString()} <span className="text-[9px] text-primary">XP</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
}
