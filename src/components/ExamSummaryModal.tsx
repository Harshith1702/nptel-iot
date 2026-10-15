import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight, X } from 'lucide-react';
import { QuizStats } from '../types/quiz';

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
  useEffect(() => {
    if (isOpen && stats.percentage >= 60) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen, stats.percentage]);

  if (!isOpen) return null;

  const passed = stats.percentage >= 40; // NPTEL passing standard is typically 40%

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Exam Evaluation Completed</h2>
          <p className="text-xs text-zinc-400 mt-1">
            NPTEL Introduction to Internet of Things Assessment Result
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-800 mb-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs text-zinc-400">Total Score</span>
            <span className="text-lg font-bold font-mono text-white">
              {stats.correct} / {stats.answered}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-zinc-800">
            <span className="text-xs text-zinc-400">Accuracy Rate</span>
            <span className={`text-xl font-bold font-mono ${
              passed ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {stats.percentage}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>{stats.correct} Correct</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-400 font-medium">
              <XCircle className="w-4 h-4" />
              <span>{stats.incorrect} Incorrect</span>
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className={`p-3 rounded-xl mb-6 text-center text-xs font-semibold ${
          passed
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
            : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
        }`}>
          {passed
            ? '🎉 Congratulations! You cleared the exam benchmark (>40%).'
            : '⚠️ Benchmark not met. Review the mistakes below to solidify concepts.'}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {stats.incorrect > 0 && (
            <button
              onClick={() => {
                onReviewMistakes();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Review {stats.incorrect} Incorrect Questions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onRetake}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition-all flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Retake</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
            >
              Continue Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
