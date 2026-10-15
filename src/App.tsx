import React, { useState, useEffect, useMemo } from 'react';
import rawQuestions from './data/questions.json';
import { Question, QuizMode, FilterStatus, QuizStats } from './types/quiz';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { WeekFilter } from './components/WeekFilter';
import { FilterBar } from './components/FilterBar';
import { QuestionCard } from './components/QuestionCard';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { SourceModal } from './components/SourceModal';
import { Footer } from './components/Footer';
import { ArrowUp, FileText, CheckCircle2 } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import { initAnalytics, trackEvent } from './utils/analytics';
import { evaluateAnswer, getQuestionCorrectKeys, normalizeSelectedAnswer } from './utils/quizUtils';

const questionsData = rawQuestions as Question[];

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('nptel_iot_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {}
    return 'dark';
  });

  useEffect(() => {
    try {
      localStorage.setItem('nptel_iot_theme', theme);
    } catch {}
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    initAnalytics();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Answers and Bookmarks
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('nptel_iot_answers');
      if (!saved) return {};
      const parsed = JSON.parse(saved);
      const normalized: Record<string, string[]> = {};
      for (const [k, v] of Object.entries(parsed)) {
        const norm = normalizeSelectedAnswer(v as string | string[]);
        if (norm.length > 0) {
          normalized[k] = norm;
        }
      }
      return normalized;
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('nptel_iot_bookmarks');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [selectedTerm, setSelectedTerm] = useState<string>('all');
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quizMode, setQuizMode] = useState<QuizMode>('practice');
  const [showAllSolutions, setShowAllSolutions] = useState<boolean>(false);
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [showExamModal, setShowExamModal] = useState<boolean>(false);
  const [showSourceModal, setShowSourceModal] = useState<boolean>(false);
  const [displayLimit, setDisplayLimit] = useState<number>(30);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('nptel_iot_answers', JSON.stringify(answers));
    } catch {}
  }, [answers]);

  useEffect(() => {
    try {
      localStorage.setItem('nptel_iot_bookmarks', JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  useEffect(() => {
    setDisplayLimit(30);
  }, [selectedTerm, selectedWeek, statusFilter, searchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const terms = useMemo(() => {
    const termMap: Record<string, { id: string; title: string; count: number }> = {};
    for (const q of questionsData) {
      if (!termMap[q.setId]) {
        termMap[q.setId] = { id: q.setId, title: q.shortTerm, count: 0 };
      }
      termMap[q.setId].count += 1;
    }
    return Object.values(termMap);
  }, []);

  const availableWeeks = useMemo(() => {
    const relevant = selectedTerm === 'all' 
      ? questionsData 
      : questionsData.filter((q) => q.setId === selectedTerm);
    const weeksSet = new Set<number>();
    relevant.forEach((q) => weeksSet.add(q.weekNum));
    return Array.from(weeksSet).sort((a, b) => a - b);
  }, [selectedTerm]);

  const handleSelectAnswer = (questionId: string, answerKey: string) => {
    const q = questionsData.find((item) => item.id === questionId);
    const correctKeys = q ? getQuestionCorrectKeys(q) : [];
    const isMsq = correctKeys.length > 1;

    setAnswers((prev) => {
      const current = prev[questionId] || [];
      let updated: string[];

      if (isMsq) {
        if (current.includes(answerKey)) {
          updated = current.filter((k) => k !== answerKey);
        } else {
          updated = [...current, answerKey].sort();
        }
      } else {
        updated = [answerKey];
      }

      if (updated.length === 0) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }

      return {
        ...prev,
        [questionId]: updated,
      };
    });
    trackEvent('answer_selected', { question_id: questionId, answer_key: answerKey });
  };

  const handleClearAnswer = (questionId: string) => {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleToggleBookmark = (questionId: string) => {
    setBookmarks((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleResetProgress = () => {
    if (window.confirm("Reset all chosen answers?")) {
      setAnswers({});
      setExamSubmitted(false);
    }
  };

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return questionsData.filter((q) => {
      if (selectedTerm !== 'all' && q.setId !== selectedTerm) return false;
      if (selectedWeek !== null && q.weekNum !== selectedWeek) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesSol = q.solution.toLowerCase().includes(query);
        const matchesOpts = q.options.some((o) => o.text.toLowerCase().includes(query));
        if (!matchesQ && !matchesSol && !matchesOpts) return false;
      }

      const evalResult = evaluateAnswer(q, answers[q.id]);
      const isAns = evalResult.isAnswered;
      const isCor = evalResult.isCorrect;
      const isBm = !!bookmarks[q.id];

      if (statusFilter === 'unanswered' && isAns) return false;
      if (statusFilter === 'incorrect' && (!isAns || isCor)) return false;
      if (statusFilter === 'correct' && (!isAns || !isCor)) return false;
      if (statusFilter === 'bookmarked' && !isBm) return false;

      return true;
    });
  }, [selectedTerm, selectedWeek, searchQuery, statusFilter, answers, bookmarks]);

  useEffect(() => {
    setDisplayLimit(30);
  }, [selectedTerm, selectedWeek, statusFilter, searchQuery]);

  const currentStats: QuizStats = useMemo(() => {
    const total = filteredQuestions.length;
    let answered = 0;
    let correct = 0;
    let incorrect = 0;

    for (const q of filteredQuestions) {
      const evalResult = evaluateAnswer(q, answers[q.id]);
      if (evalResult.isAnswered) {
        answered++;
        if (evalResult.isCorrect) {
          correct++;
        } else {
          incorrect++;
        }
      }
    }

    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { total, answered, correct, incorrect, percentage };
  }, [filteredQuestions, answers]);

  const filterCounts = useMemo(() => {
    const baseList = questionsData.filter((q) => {
      if (selectedTerm !== 'all' && q.setId !== selectedTerm) return false;
      if (selectedWeek !== null && q.weekNum !== selectedWeek) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesSol = q.solution.toLowerCase().includes(query);
        const matchesOpts = q.options.some((o) => o.text.toLowerCase().includes(query));
        if (!matchesQ && !matchesSol && !matchesOpts) return false;
      }
      return true;
    });

    let unanswered = 0;
    let correct = 0;
    let incorrect = 0;
    let bookmarked = 0;

    for (const q of baseList) {
      const evalResult = evaluateAnswer(q, answers[q.id]);
      if (!evalResult.isAnswered) {
        unanswered++;
      } else if (evalResult.isCorrect) {
        correct++;
      } else {
        incorrect++;
      }
      if (bookmarks[q.id]) {
        bookmarked++;
      }
    }

    return {
      all: baseList.length,
      unanswered,
      correct,
      incorrect,
      bookmarked,
    };
  }, [selectedTerm, selectedWeek, searchQuery, answers, bookmarks]);

  const weekStats = useMemo(() => {
    const stats: Record<number, { total: number; answered: number; correct: number }> = {};
    const relevant = selectedTerm === 'all' 
      ? questionsData 
      : questionsData.filter((q) => q.setId === selectedTerm);

    for (const q of relevant) {
      if (!stats[q.weekNum]) {
        stats[q.weekNum] = { total: 0, answered: 0, correct: 0 };
      }
      stats[q.weekNum].total += 1;
      const evalResult = evaluateAnswer(q, answers[q.id]);
      if (evalResult.isAnswered) {
        stats[q.weekNum].answered += 1;
        if (evalResult.isCorrect) {
          stats[q.weekNum].correct += 1;
        }
      }
    }
    return stats;
  }, [selectedTerm, answers]);

  const bookmarkedTotal = Object.values(bookmarks).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-150">
      <Header
        terms={terms}
        selectedTerm={selectedTerm}
        onSelectTerm={(t) => {
          setSelectedTerm(t);
          setSelectedWeek(null);
        }}
        quizMode={quizMode}
        onToggleMode={(mode) => {
          setQuizMode(mode);
          if (mode === 'practice') {
            setExamSubmitted(false);
          }
        }}
        showAllSolutions={showAllSolutions}
        onToggleAllSolutions={() => setShowAllSolutions(!showAllSolutions)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetProgress={handleResetProgress}
        totalQuestions={questionsData.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Authentic Provenance Notice */}
        <div className="mb-5 p-3 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span className="text-zinc-700 dark:text-zinc-300">
              Direct archive from official NPTEL IIT Kharagpur course portal. Non-commercial student revision aid.
            </span>
          </div>
          <button
            onClick={() => setShowSourceModal(true)}
            className="self-start sm:self-auto flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex-shrink-0"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official PDFs & Slides</span>
          </button>
        </div>

        <StatsOverview stats={currentStats} bookmarkedCount={bookmarkedTotal} />

        <WeekFilter
          weeks={availableWeeks}
          selectedWeek={selectedWeek}
          onSelectWeek={setSelectedWeek}
          weekCounts={weekStats}
          totalCount={
            selectedTerm === 'all'
              ? questionsData.length
              : questionsData.filter((q) => q.setId === selectedTerm).length
          }
        />

        <FilterBar
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
          counts={filterCounts}
          quizMode={quizMode}
          onSubmitExam={() => {
            setExamSubmitted(true);
            setShowExamModal(true);
          }}
          examSubmitted={examSubmitted}
        />

        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <p className="text-xs font-mono text-zinc-500">
              No questions found matching criteria.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedWeek(null);
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1 rounded text-xs font-mono border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-2 px-1">
              <span>Showing {Math.min(displayLimit, filteredQuestions.length)} of {filteredQuestions.length}</span>
            </div>

            {filteredQuestions.slice(0, displayLimit).map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selectedAnswer={answers[q.id]}
                onSelectAnswer={handleSelectAnswer}
                onClearAnswer={handleClearAnswer}
                isBookmarked={!!bookmarks[q.id]}
                onToggleBookmark={handleToggleBookmark}
                quizMode={quizMode}
                forceShowSolution={showAllSolutions}
                examSubmitted={examSubmitted}
              />
            ))}

            {filteredQuestions.length > displayLimit && (
              <div className="text-center py-6">
                <button
                  onClick={() => setDisplayLimit((prev) => prev + 30)}
                  className="px-4 py-2 rounded text-xs font-mono border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Load More ({filteredQuestions.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-5 right-5 p-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 shadow-lg hover:border-zinc-400 transition-colors z-30"
          aria-label="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      <ExamSummaryModal
        isOpen={showExamModal}
        onClose={() => setShowExamModal(false)}
        stats={currentStats}
        onReviewMistakes={() => setStatusFilter('incorrect')}
        onRetake={() => {
          setAnswers({});
          setExamSubmitted(false);
          setShowExamModal(false);
        }}
      />

      <SourceModal
        isOpen={showSourceModal}
        onClose={() => setShowSourceModal(false)}
      />

      <Footer />
      <Analytics />
    </div>
  );
};

export default App;
