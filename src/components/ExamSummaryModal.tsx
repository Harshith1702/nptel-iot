import React from 'react';
import { QuizStats } from '../types/quiz';
import { X, Star } from 'lucide-react';

interface ExamSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: QuizStats;
  onReviewMistakes: () => void;
  onRetake: () => void;
}

export const ExamSummaryModal: React.FC<ExamSummaryModalProps> = ({
  isOpen,
  onClose,
  stats,
  onReviewMistakes,
  onRetake,
}) => {
  if (!isOpen) return null;

  const passed = stats.percentage >= 40;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-white dark:bg-[#111111] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 shadow-xl font-sans">
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-mono tracking-tight mb-1">
          Exam Summary
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          NPTEL Introduction to IoT assessment result
        </p>

        {/* Minimal Score breakdown */}
        <div className="border border-zinc-200 dark:border-zinc-800 rounded p-3 mb-4 space-y-2 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-500">SCORE</span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">
              {stats.correct} / {stats.answered}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">ACCURACY</span>
            <span className={`font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {stats.percentage}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">STATUS</span>
            <span className={`font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {passed ? 'PASSED (>=40%)' : 'NEEDS PRACTICE'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {stats.incorrect > 0 && (
            <button
              onClick={() => {
                onReviewMistakes();
                onClose();
              }}
              className="w-full py-1.5 px-3 rounded text-xs font-mono font-medium border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 transition-colors"
            >
              Filter {stats.incorrect} Incorrect Questions
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={onRetake}
              className="flex-1 py-1.5 px-3 rounded text-xs font-mono border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-1.5 px-3 rounded text-xs font-mono font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity"
            >
              Review
            </button>
          </div>
        </div>

        {/* Star & Follow Footnote */}
        <div className="mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Found this useful?</span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/Harshith1702/nptel-iot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-zinc-700 dark:text-zinc-300 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Star repo</span>
            </a>
            <span>•</span>
            <a
              href="https://x.com/harshith_irl"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-900 dark:hover:text-zinc-100 underline transition-colors"
            >
              @harshith_irl
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
