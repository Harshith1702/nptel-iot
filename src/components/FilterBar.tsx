import React from 'react';
import { FilterStatus, QuizMode } from '../types/quiz';
import { CheckCheck, Bookmark, Send, Sparkles } from 'lucide-react';

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
  const tabs: { id: FilterStatus; label: string; count: number; color?: string }[] = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'unanswered', label: 'Unanswered', count: counts.unanswered },
    { id: 'incorrect', label: 'Incorrect', count: counts.incorrect, color: 'text-rose-400' },
    { id: 'correct', label: 'Correct', count: counts.correct, color: 'text-emerald-400' },
    { id: 'bookmarked', label: 'Bookmarked', count: counts.bookmarked, color: 'text-amber-400' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-zinc-900/40 p-2 rounded-xl border border-zinc-800/60">
      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-zinc-800 text-white font-semibold shadow-sm border border-zinc-700/60'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-zinc-700 text-white' : 'bg-zinc-800/80 text-zinc-500'
                } ${tab.color && tab.count > 0 ? tab.color : ''}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exam Mode Action Button */}
      {quizMode === 'exam' && (
        <div className="flex items-center gap-2">
          <button
            onClick={onSubmitExam}
            className={`w-full sm:w-auto px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              examSubmitted
                ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20'
            }`}
          >
            {examSubmitted ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Send className="w-3.5 h-3.5" />}
            <span>{examSubmitted ? 'View Exam Results' : 'Submit & Review Exam'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
