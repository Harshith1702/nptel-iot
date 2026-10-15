import React from 'react';
import { CheckCircle2, XCircle, BarChart3, Target, Bookmark, Sparkles } from 'lucide-react';
import { QuizStats } from '../types/quiz';

interface StatsOverviewProps {
  stats: QuizStats;
  bookmarkedCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, bookmarkedCount }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.answered / stats.total) * 100) : 0;
  
  return (
    <div className="w-full mb-6">
      {/* 4 Cards Grid - Watermelon UI aesthetic */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total & Attempted */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Attempted</span>
            <div className="h-7 w-7 rounded-lg bg-zinc-800/70 border border-zinc-700/50 flex items-center justify-center text-zinc-300">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">{stats.answered}</span>
            <span className="text-xs text-zinc-500">/ {stats.total} Qs</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2.5 w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 flex justify-between">
            <span>{completionRate}% complete</span>
            <span>{stats.total - stats.answered} left</span>
          </div>
        </div>

        {/* Card 2: Correct Answers */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-emerald-400/80 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Correct</span>
            <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 tracking-tight">{stats.correct}</span>
            <span className="text-xs text-emerald-500/70">
              {stats.answered > 0 ? `${Math.round((stats.correct / stats.answered) * 100)}% of tried` : '0%'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Validated against official keys
          </p>
        </div>

        {/* Card 3: Incorrect Answers */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-rose-400/80 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">Incorrect</span>
            <div className="h-7 w-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <XCircle className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400 tracking-tight">{stats.incorrect}</span>
            <span className="text-xs text-rose-500/70">
              {stats.answered > 0 ? `${Math.round((stats.incorrect / stats.answered) * 100)}%` : '0%'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-zinc-500">
            Ready for revision review
          </p>
        </div>

        {/* Card 4: Accuracy & Bookmarks */}
        <div className="bg-zinc-900/50 backdrop-blur border border-zinc-800/80 rounded-xl p-3.5 sm:p-4 hover:border-zinc-700/80 transition-all">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Accuracy</span>
            <div className="h-7 w-7 rounded-lg bg-zinc-800/70 border border-zinc-700/50 flex items-center justify-center text-amber-400">
              <Target className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold tracking-tight ${
              stats.percentage >= 75 ? 'text-emerald-400' : stats.percentage >= 50 ? 'text-amber-400' : 'text-zinc-200'
            }`}>
              {stats.percentage}%
            </span>
            <span className="text-xs text-zinc-500">
              {stats.percentage >= 75 ? 'Excellent' : stats.percentage >= 50 ? 'Good' : 'Needs Practice'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
            <span className="flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-amber-400" />
              {bookmarkedCount} starred
            </span>
            <span className="text-zinc-400">Pass: 40%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
