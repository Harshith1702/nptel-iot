import React, { useState } from 'react';
import { Question, QuizMode } from '../types/quiz';
import { Check, X, Bookmark, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: string | undefined;
  onSelectAnswer: (questionId: string, answerKey: string) => void;
  onClearAnswer: (questionId: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (questionId: string) => void;
  quizMode: QuizMode;
  forceShowSolution: boolean;
  examSubmitted: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  onClearAnswer,
  isBookmarked,
  onToggleBookmark,
  quizMode,
  forceShowSolution,
  examSubmitted,
}) => {
  const [showSolutionLocal, setShowSolutionLocal] = useState(false);
  const isSolutionVisible = forceShowSolution || showSolutionLocal;

  // Evaluated if in practice mode and answered, OR if exam is submitted, OR if user opened solution
  const isEvaluated = (quizMode === 'practice' && !!selectedAnswer) || examSubmitted || isSolutionVisible;
  const isUserCorrect = selectedAnswer === question.correctAnswer;
  const isAnswered = !!selectedAnswer;

  return (
    <article
      className={`border rounded-lg p-4 sm:p-5 mb-3 transition-colors ${
        isEvaluated && isAnswered
          ? isUserCorrect
            ? 'border-emerald-500/40 bg-emerald-500/[0.02] dark:border-emerald-500/30 dark:bg-emerald-950/[0.05]'
            : 'border-rose-500/40 bg-rose-500/[0.02] dark:border-rose-500/30 dark:bg-rose-950/[0.05]'
          : 'border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#111111]'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            Q{question.questionNum}
          </span>
          <span>•</span>
          <span>{question.week}</span>
          <span>•</span>
          <span className="hidden sm:inline">{question.shortTerm}</span>
        </div>

        <div className="flex items-center gap-2">
          {isAnswered && (
            <button
              onClick={() => onClearAnswer(question.id)}
              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
              title="Clear selection"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`transition-colors ${
              isBookmarked
                ? 'text-amber-500'
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'
            }`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <h3 className="text-zinc-900 dark:text-zinc-100 text-sm sm:text-base font-normal leading-relaxed mb-3.5">
        {question.question}
      </h3>

      {/* Options Radio List */}
      <div className="space-y-2 mb-3">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          const isTargetCorrect = opt.key === question.correctAnswer;

          let optionBorder = 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-800 dark:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600';
          let radioDot = 'border-zinc-400 dark:border-zinc-600';
          let badge = null;

          if (isEvaluated) {
            if (isSelected) {
              if (isTargetCorrect) {
                // Correct selected: Clean Emerald
                optionBorder = 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200 font-medium';
                radioDot = 'border-emerald-600 dark:border-emerald-500 bg-emerald-600 dark:bg-emerald-500 text-white';
                badge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                    <Check className="w-3 h-3 stroke-[3]" /> Correct
                  </span>
                );
              } else {
                // Wrong selected: Clean Rose
                optionBorder = 'border-rose-600 dark:border-rose-500 bg-rose-50/80 dark:bg-rose-950/20 text-rose-950 dark:text-rose-200 font-medium';
                radioDot = 'border-rose-600 dark:border-rose-500 bg-rose-600 dark:bg-rose-500 text-white';
                badge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono text-rose-700 dark:text-rose-400">
                    <X className="w-3 h-3 stroke-[3]" /> Incorrect
                  </span>
                );
              }
            } else if (isTargetCorrect) {
              // Highlight the true correct option
              optionBorder = 'border-emerald-500/60 dark:border-emerald-500/40 bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-900 dark:text-emerald-300';
              radioDot = 'border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400';
              badge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                  <Check className="w-3 h-3 stroke-[2.5]" /> Correct Answer
                </span>
              );
            }
          } else if (isSelected) {
            // Exam mode selected (unsubmitted)
            optionBorder = 'border-zinc-900 dark:border-zinc-100 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium';
            radioDot = 'border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900';
          }

          return (
            <label
              key={opt.key}
              onClick={() => onSelectAnswer(question.id, opt.key)}
              className={`flex items-start sm:items-center justify-between gap-3 p-2.5 sm:px-3 rounded-md border cursor-pointer transition-colors ${optionBorder}`}
            >
              <div className="flex items-center gap-2.5">
                {/* Minimal Radio Circle */}
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${radioDot}`}
                >
                  {isEvaluated && isSelected ? (
                    isTargetCorrect ? (
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    ) : (
                      <X className="w-2.5 h-2.5 stroke-[3]" />
                    )
                  ) : isSelected ? (
                    <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-zinc-900" />
                  ) : null}
                </div>

                {/* Option Text */}
                <div className="text-xs sm:text-sm">
                  <span className="font-mono font-semibold mr-1.5 opacity-80 uppercase">
                    {opt.key}.
                  </span>
                  <span>{opt.text}</span>
                </div>
              </div>

              {/* Status Badge */}
              {badge && <div className="flex-shrink-0 ml-2">{badge}</div>}
            </label>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
        <button
          onClick={() => setShowSolutionLocal(!showSolutionLocal)}
          className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors"
        >
          <span>{showSolutionLocal ? 'Hide Solution' : 'Solution'}</span>
          {showSolutionLocal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {isSolutionVisible && (
          <span className="font-mono text-zinc-500">
            Key: <strong className="text-emerald-600 dark:text-emerald-400 uppercase">{question.correctAnswer}</strong>
          </span>
        )}
      </div>

      {/* Collapsible Solution */}
      {isSolutionVisible && (
        <div className="mt-2.5 p-3 rounded bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
            Answer: {question.correctAnswer.toUpperCase()}
          </div>
          <div>{question.solution || "Refer to NPTEL course lecture material for this topic."}</div>
        </div>
      )}
    </article>
  );
};
