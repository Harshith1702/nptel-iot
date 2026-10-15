import React from 'react';
import { FilterStatus, QuizMode } from '../types/quiz';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  counts: {
    all: number;
    unanswered: number;
    incorrect: number;
    correct: number;
    bookmarked: number;
  };
  quizMode: QuizMode;
  onSubmitExam: () => void;
  examSubmitted: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentFilter,
  onFilterChange,
  counts,
  quizMode,
  onSubmitExam,
  examSubmitted,
}) => {
  const filters: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'unanswered', label: 'Unanswered', count: counts.unanswered },
    { id: 'incorrect', label: 'Incorrect', count: counts.incorrect },
    { id: 'correct', label: 'Correct', count: counts.correct },
    { id: 'bookmarked', label: 'Starred', count: counts.bookmarked },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-xs">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-2.5 py-1 rounded transition-colors ${
              currentFilter === f.id
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {quizMode === 'exam' && (
        <button
          onClick={onSubmitExam}
          className="px-3 py-1 rounded bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-mono font-semibold hover:opacity-90 transition-opacity"
        >
          {examSubmitted ? 'View Score' : 'Submit Exam'}
        </button>
      )}
    </div>
  );
};
