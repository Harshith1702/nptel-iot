import React from 'react';

interface WeekFilterProps {
  weeks: number[];
  selectedWeek: number | null; // null means All
  onSelectWeek: (week: number | null) => void;
  weekCounts: Record<number, { total: number; answered: number; correct: number }>;
  totalCount: number;
}

export const WeekFilter: React.FC<WeekFilterProps> = ({
  weeks,
  selectedWeek,
  onSelectWeek,
  weekCounts,
  totalCount,
}) => {
  return (
    <div className="w-full mb-5">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {/* All Weeks Pill */}
        <button
          onClick={() => onSelectWeek(null)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
            selectedWeek === null
              ? 'bg-zinc-100 text-zinc-950 shadow-sm'
              : 'bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/80 border border-zinc-800'
          }`}
        >
          <span>All Weeks</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
            selectedWeek === null ? 'bg-zinc-300 text-zinc-900' : 'bg-zinc-800 text-zinc-400'
          }`}>
            {totalCount}
          </span>
        </button>

        {/* Individual Weeks */}
        {weeks.map((w) => {
          const stats = weekCounts[w] || { total: 0, answered: 0, correct: 0 };
          const isSelected = selectedWeek === w;
          const isFinished = stats.total > 0 && stats.answered === stats.total;

          return (
            <button
              key={w}
              onClick={() => onSelectWeek(w)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500/80 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : isFinished
                  ? 'bg-zinc-900/90 border-emerald-900/40 text-zinc-300 hover:border-zinc-700'
                  : 'bg-zinc-900/60 border-zinc-800/90 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <span>Week {w}</span>
              <span
                className={`text-[10px] font-mono px-1 rounded ${
                  isSelected
                    ? 'bg-emerald-500/30 text-emerald-200'
                    : stats.answered > 0
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'text-zinc-500'
                }`}
              >
                {stats.answered > 0 ? `${stats.answered}/${stats.total}` : stats.total}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
