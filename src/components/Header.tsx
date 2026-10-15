import React from 'react';
import { BookOpen, GraduationCap, RotateCcw, Eye, EyeOff, Search, Sparkles } from 'lucide-react';
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
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-[#090a0f]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">NPTEL IoT Master</h1>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  IIT Kharagpur
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                  {totalQuestions} Qs
                </span>
              </div>
              <p className="text-xs text-zinc-400 hidden sm:block">
                Introduction to Internet of Things — Assignments & Full Solutions
              </p>
            </div>
          </div>

          {/* Controls & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search topics, MQTT, CoAP, SDN..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-zinc-900/80 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                >
                  ×
                </button>
              )}
            </div>

            {/* Term Dropdown */}
            <select
              value={selectedTerm}
              onChange={(e) => onSelectTerm(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500/60 transition-all cursor-pointer"
            >
              <option value="all">All Sessions ({totalQuestions})</option>
              {terms.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title} ({t.count} Qs)
                </option>
              ))}
            </select>

            {/* Mode Switcher */}
            <div className="inline-flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <button
                onClick={() => onToggleMode('practice')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  quizMode === 'practice'
                    ? 'bg-emerald-500 text-zinc-950 shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Instant red/green answer reveal per question"
              >
                Instant Mode
              </button>
              <button
                onClick={() => onToggleMode('exam')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  quizMode === 'exam'
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title="Exam simulation: reveals score after completing"
              >
                Exam Mode
              </button>
            </div>

            {/* Toggle Solutions */}
            <button
              onClick={onToggleAllSolutions}
              className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all ${
                showAllSolutions
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
              }`}
              title={showAllSolutions ? "Hide all solutions" : "Show all solutions"}
            >
              {showAllSolutions ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Answers</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onResetProgress}
              className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-900/50 transition-all text-xs"
              title="Reset All Answers"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
