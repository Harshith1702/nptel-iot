import React from 'react';
import { Sun, Moon, Search, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { QuizMode } from '../types/quiz';

interface HeaderProps {
  terms: { id: string; title: string; count: number }[];
  selectedTerm: string;
  onSelectTerm: (term: string) => void;
  quizMode: QuizMode;
  onToggleMode: (mode: QuizMode) => void;
  showAllSolutions: boolean;
  onToggleAllSolutions: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onResetProgress: () => void;
  totalQuestions: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  terms,
  selectedTerm,
  onSelectTerm,
  quizMode,
  onToggleMode,
  showAllSolutions,
  onToggleAllSolutions,
  searchQuery,
  onSearchChange,
  onResetProgress,
  totalQuestions,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="font-mono font-bold text-base tracking-tight text-zinc-900 dark:text-zinc-100">
                NPTEL<span className="text-emerald-600 dark:text-emerald-400">.</span>IoT
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                IIT KGP
              </span>
              <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 hidden sm:inline">
                {totalQuestions} Qs
              </span>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="md:hidden p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search questions or topics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 rounded-md pl-8 pr-2.5 py-1 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
              />
            </div>

            {/* Session Selector */}
            <select
              value={selectedTerm}
              onChange={(e) => onSelectTerm(e.target.value)}
              className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-800 dark:text-zinc-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="all">All Sessions</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>

            {/* Mode Toggle (Instant vs Exam) */}
            <div className="inline-flex rounded-md border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-900 text-xs">
              <button
                onClick={() => onToggleMode('practice')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  quizMode === 'practice'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Instant
              </button>
              <button
                onClick={() => onToggleMode('exam')}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  quizMode === 'exam'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-semibold'
                    : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                Exam
              </button>
            </div>

            {/* Global Answer Toggle */}
            <button
              onClick={onToggleAllSolutions}
              className={`px-2 py-1 rounded-md border text-xs font-medium flex items-center gap-1 transition-colors ${
                showAllSolutions
                  ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
              title="Toggle all answers"
            >
              {showAllSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Answers</span>
            </button>

            {/* Reset */}
            <button
              onClick={onResetProgress}
              className="p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-rose-600 dark:hover:text-rose-400 bg-zinc-50 dark:bg-zinc-900 transition-colors"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Desktop Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="hidden md:flex p-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
