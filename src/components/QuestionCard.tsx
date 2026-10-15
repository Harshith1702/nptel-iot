import React, { useState } from 'react';
import { Question, QuizMode } from '../types/quiz';
import { Check, X, Bookmark, ChevronDown, ChevronUp, Lightbulb, HelpCircle, CheckCircle, RotateCcw } from 'lucide-react';

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

  // Reveal correctness if in practice mode and answered, OR if exam is submitted, OR if user explicitly opened solution
  const isEvaluated = (quizMode === 'practice' && !!selectedAnswer) || examSubmitted || isSolutionVisible;
  const isUserCorrect = selectedAnswer === question.correctAnswer;
  const isAnswered = !!selectedAnswer;

  return (
    <div
      className={`rounded-xl border transition-all duration-200 bg-zinc-900/40 backdrop-blur-sm p-5 sm:p-6 mb-4 ${
        isEvaluated && isAnswered
          ? isUserCorrect
            ? 'border-emerald-500/30 hover:border-emerald-500/50 shadow-sm shadow-emerald-500/5'
            : 'border-rose-500/30 hover:border-rose-500/50 shadow-sm shadow-rose-500/5'
          : 'border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Header Info */}
      <div className="flex items-center justify-between gap-3 mb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-zinc-800 text-zinc-200 border border-zinc-700/60">
            Q{question.questionNum}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {question.week}
          </span>
          <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-800">
            {question.shortTerm}
          </span>
          {isEvaluated && isAnswered && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold ${
                isUserCorrect
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isUserCorrect ? (
                <>
                  <Check className="w-3 h-3 stroke-[3]" /> Correct
                </>
              ) : (
                <>
                  <X className="w-3 h-3 stroke-[3]" /> Incorrect
                </>
              )}
            </span>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          {isAnswered && (
            <button
              onClick={() => onClearAnswer(question.id)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60 transition-colors"
              title="Clear selection"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onToggleBookmark(question.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-amber-400 bg-amber-400/10 border border-amber-400/20'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
            }`}
            title={isBookmarked ? "Remove bookmark" : "Bookmark question"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Question Text */}
      <h3 className="text-zinc-100 font-semibold text-sm sm:text-base leading-relaxed mb-4">
        {question.question}
      </h3>

      {/* Options Radio List */}
      <div className="space-y-2.5 mb-4">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.key;
          const isTargetCorrect = opt.key === question.correctAnswer;

          let optionStyle = 'border-zinc-800/90 bg-zinc-900/30 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800/30';
          let radioStyle = 'border-zinc-700 bg-zinc-800/60 text-zinc-400';
          let badge = null;

          if (isEvaluated) {
            if (isSelected) {
              if (isTargetCorrect) {
                // Correct selected: vivid Green
                optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-200 font-semibold ring-1 ring-emerald-500/30';
                radioStyle = 'border-emerald-500 bg-emerald-500 text-zinc-950';
                badge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                    <Check className="w-3 h-3 stroke-[3]" /> Your Answer (Correct)
                  </span>
                );
              } else {
                // Wrong selected: vivid Red
                optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-200 font-semibold ring-1 ring-rose-500/30';
                radioStyle = 'border-rose-500 bg-rose-500 text-white';
                badge = (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                    <X className="w-3 h-3 stroke-[3]" /> Your Answer (Wrong)
                  </span>
                );
              }
            } else if (isTargetCorrect) {
              // Highlight the correct answer in emerald
              optionStyle = 'border-emerald-500/50 bg-emerald-500/5 text-emerald-300';
              radioStyle = 'border-emerald-500/60 text-emerald-400';
              badge = (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <Check className="w-3 h-3 stroke-[2.5]" /> Correct Answer
                </span>
              );
            }
          } else if (isSelected) {
            // Exam mode selected (unsubmitted)
            optionStyle = 'border-blue-500/80 bg-blue-500/10 text-blue-200 font-medium ring-1 ring-blue-500/30';
            radioStyle = 'border-blue-500 bg-blue-500 text-white';
          }

          return (
            <label
              key={opt.key}
              onClick={() => onSelectAnswer(question.id, opt.key)}
              className={`flex items-start sm:items-center justify-between gap-3 p-3 sm:py-2.5 sm:px-3.5 rounded-lg border cursor-pointer transition-all ${optionStyle}`}
            >
              <div className="flex items-center gap-3">
                {/* Custom radio button icon */}
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${radioStyle}`}
                >
                  {isEvaluated && isSelected ? (
                    isTargetCorrect ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    )
                  ) : isSelected ? (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  ) : (
                    <span className="text-[11px] font-mono font-medium">{opt.key.toUpperCase()}</span>
                  )}
                </div>

                {/* Option text */}
                <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
              </div>

              {/* Status Badge */}
              {badge && <div className="flex-shrink-0 ml-2">{badge}</div>}
            </label>
          );
        })}
      </div>

      {/* Footer bar with Solution toggle */}
      <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between gap-2">
        <button
          onClick={() => setShowSolutionLocal(!showSolutionLocal)}
          className={`text-xs font-medium flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
            showSolutionLocal
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>{showSolutionLocal ? 'Hide Solution' : 'Show Answer & Solution'}</span>
          {showSolutionLocal ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {/* Small hint of correct answer if user wants direct glance */}
        {isSolutionVisible && (
          <span className="text-xs font-mono text-zinc-400">
            Key: <strong className="text-emerald-400 uppercase">{question.correctAnswer}</strong>
          </span>
        )}
      </div>

      {/* Collapsible Solution Box */}
      {isSolutionVisible && (
        <div className="mt-3 p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800/90 text-xs sm:text-sm space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            <span>Official Correct Answer: {question.correctAnswer.toUpperCase()}</span>
          </div>
          {question.solution ? (
            <div className="text-zinc-300 leading-relaxed font-normal">
              {question.solution}
            </div>
          ) : (
            <div className="text-zinc-400 italic">
              Refer to NPTEL course lecture material for this topic.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
