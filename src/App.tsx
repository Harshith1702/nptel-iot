import React, { useState, useEffect, useMemo } from 'react';
import rawQuestions from './data/questions.json';
import { Question, QuizMode, FilterStatus, QuizStats } from './types/quiz';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { WeekFilter } from './components/WeekFilter';
import { FilterBar } from './components/FilterBar';
import { QuestionCard } from './components/QuestionCard';
import { ExamSummaryModal } from './components/ExamSummaryModal';
import { BookOpen, Sparkles, Filter, AlertCircle, ArrowUp } from 'lucide-react';

const questionsData = rawQuestions as Question[];

export const App: React.FC = () => {
  // State
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('nptel_iot_answers');
      return saved ? JSON.parse(saved) : {};
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
  const [displayLimit, setDisplayLimit] = useState<number>(30);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync to localStorage
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

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Available Terms
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

  // Available Weeks in selected Term
  const availableWeeks = useMemo(() => {
    const relevant = selectedTerm === 'all' 
      ? questionsData 
      : questionsData.filter((q) => q.setId === selectedTerm);
    const weeksSet = new Set<number>();
    relevant.forEach((q) => weeksSet.add(q.weekNum));
    return Array.from(weeksSet).sort((a, b) => a - b);
  }, [selectedTerm]);

  // Answer handler - lets user check / change choice immediately
  const handleSelectAnswer = (questionId: string, answerKey: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerKey,
    }));
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
    if (window.confirm("Are you sure you want to reset all selected answers?")) {
      setAnswers({});
      setExamSubmitted(false);
    }
  };

  // Filtered Questions
  const filteredQuestions = useMemo(() => {
    return questionsData.filter((q) => {
      // Term filter
      if (selectedTerm !== 'all' && q.setId !== selectedTerm) return false;

      // Week filter
      if (selectedWeek !== null && q.weekNum !== selectedWeek) return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesQ = q.question.toLowerCase().includes(query);
        const matchesSol = q.solution.toLowerCase().includes(query);
        const matchesOpts = q.options.some((o) => o.text.toLowerCase().includes(query));
        if (!matchesQ && !matchesSol && !matchesOpts) return false;
      }

      // Status filter
      const ans = answers[q.id];
      const isAns = !!ans;
      const isCor = ans === q.correctAnswer;
      const isBm = !!bookmarks[q.id];

      if (statusFilter === 'unanswered' && isAns) return false;
      if (statusFilter === 'incorrect' && (!isAns || isCor)) return false;
      if (statusFilter === 'correct' && (!isAns || !isCor)) return false;
      if (statusFilter === 'bookmarked' && !isBm) return false;

      return true;
    });
  }, [selectedTerm, selectedWeek, searchQuery, statusFilter, answers, bookmarks]);

  // Reset display limit on filter change
  useEffect(() => {
    setDisplayLimit(30);
  }, [selectedTerm, selectedWeek, statusFilter, searchQuery]);

  // Overall and current filter stats
  const currentStats: QuizStats = useMemo(() => {
    const total = filteredQuestions.length;
    let answered = 0;
    let correct = 0;
    let incorrect = 0;

    for (const q of filteredQuestions) {
      const userAns = answers[q.id];
      if (userAns) {
        answered++;
        if (userAns === q.correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      }
    }

    const percentage = answered > 0 ? Math.round((correct / answered) * 100) : 0;
    return { total, answered, correct, incorrect, percentage };
  }, [filteredQuestions, answers]);

  // Filter counts for tabs
  const filterCounts = useMemo(() => {
    // Calculate for current Term + Week + Search
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
      const userAns = answers[q.id];
      if (!userAns) {
        unanswered++;
      } else if (userAns === q.correctAnswer) {
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

  // Week breakdown stats
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
      if (answers[q.id]) {
        stats[q.weekNum].answered += 1;
        if (answers[q.id] === q.correctAnswer) {
          stats[q.weekNum].correct += 1;
        }
      }
    }
    return stats;
  }, [selectedTerm, answers]);

  const bookmarkedTotal = Object.values(bookmarks).filter(Boolean).length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-zinc-100 flex flex-col font-sans">
      {/* Top Navigation */}
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
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Modern Dashboard Stats Cards */}
        <StatsOverview stats={currentStats} bookmarkedCount={bookmarkedTotal} />

        {/* Week Selector Tabs */}
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

        {/* Secondary Filter Bar */}
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

        {/* Questions Stream */}
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 rounded-2xl border border-zinc-800">
            <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-400 mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-200">No questions match your current filters</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Try resetting filters, searching different keywords, or selecting another week.
            </p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setSelectedWeek(null);
                setSearchQuery('');
              }}
              className="mt-4 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-3 px-1">
              <span>
                Showing {Math.min(displayLimit, filteredQuestions.length)} of {filteredQuestions.length} questions
              </span>
              {filteredQuestions.length > displayLimit && (
                <span>Scroll down to load more</span>
              )}
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
                  onClick={() => setDisplayLimit((prev) => prev + 40)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 shadow-sm transition-all"
                >
                  Load Next 40 Questions ({filteredQuestions.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-2.5 rounded-xl bg-zinc-800/90 text-zinc-200 border border-zinc-700 hover:bg-emerald-500 hover:text-zinc-950 transition-all shadow-xl z-40"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Exam Result Modal */}
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
    </div>
  );
};

export default App;
