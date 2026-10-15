import React from 'react';
import { QuizStats } from '../types/quiz';

interface StatsOverviewProps {
  stats: QuizStats;
  bookmarkedCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, bookmarkedCount }) => {
  const completionRate = stats.total > 0 ? Math.round((stats.answered / stats.total) * 100) : 0;

  return (
    <div className="w-full mb-5 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 sm:p-4 bg-zinc-50/50 dark:bg-zinc-900/40">
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-xs">
        {/* Metric Items */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono">
          <div>
            <span className="text-zinc-500 mr-1.5">ATTEMPTED:</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {stats.answered}
            </span>
            <span className="text-zinc-400">/{stats.total}</span>
          </div>

          <div>
            <span className="text-zinc-500 mr-1.5">CORRECT:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.correct}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 mr-1.5">INCORRECT:</span>
            <span className="font-semibold text-rose-600 dark:text-rose-400">
              {stats.incorrect}
            </span>
          </div>

          <div>
            <span className="text-zinc-500 mr-1.5">ACCURACY:</span>
            <span className={`font-semibold ${
              stats.percentage >= 60
                ? 'text-emerald-600 dark:text-emerald-400'
                : stats.percentage >= 40
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-zinc-700 dark:text-zinc-300'
            }`}>
              {stats.percentage}%
            </span>
          </div>

          {bookmarkedCount > 0 && (
            <div>
              <span className="text-zinc-500 mr-1.5">STARRED:</span>
              <span className="font-semibold text-amber-500">{bookmarkedCount}</span>
            </div>
          )}
        </div>

        {/* Completion % */}
        <div className="text-[11px] font-mono text-zinc-400">
          {completionRate}% completed
        </div>
      </div>

      {/* Thin line progress bar */}
      <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1 rounded-full overflow-hidden mt-3">
        <div
          className="bg-emerald-500 dark:bg-emerald-400 h-full transition-all duration-200"
          style={{ width: `${completionRate}%` }}
        />
      </div>
    </div>
  );
};
