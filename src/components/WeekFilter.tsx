import React, { useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface WeekFilterProps {
  weeks: number[];
  selectedWeek: number | null;
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (selectedBtnRef.current) {
      selectedBtnRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [selectedWeek]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full mb-4">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => scrollBy(-180)}
          className="hidden sm:flex items-center justify-center p-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 flex-shrink-0 transition-colors"
          aria-label="Scroll weeks left"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none flex-1 touch-pan-x"
        >
          <button
            ref={selectedWeek === null ? selectedBtnRef : null}
            onClick={() => onSelectWeek(null)}
            className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
              selectedWeek === null
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 font-semibold'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900'
            }`}
          >
            All Weeks ({totalCount})
          </button>

          {weeks.map((w) => {
            const stats = weekCounts[w] || { total: 0, answered: 0, correct: 0 };
            const isSelected = selectedWeek === w;
            const isComplete = stats.total > 0 && stats.answered === stats.total;

            return (
              <button
                key={w}
                ref={isSelected ? selectedBtnRef : null}
                onClick={() => onSelectWeek(w)}
                className={`flex-shrink-0 px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:text-zinc-950 dark:border-emerald-500 font-semibold shadow-sm'
                    : isComplete
                    ? 'border-emerald-300 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/10'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900'
                }`}
              >
                W{w}
                {stats.answered > 0 && !isSelected && (
                  <span className="ml-1 text-[10px] opacity-75">
                    ({stats.answered}/{stats.total})
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => scrollBy(180)}
          className="hidden sm:flex items-center justify-center p-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900 flex-shrink-0 transition-colors"
          aria-label="Scroll weeks right"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
