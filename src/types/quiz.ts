export interface Option {
  key: string;
  text: string;
}

export interface Question {
  id: string;
  setId: string;
  term: string;
  shortTerm: string;
  week: string;
  weekNum: number;
  questionNum: number;
  question: string;
  options: Option[];
  correctAnswer: string;
  correctKeys: string[];
  answerRaw: string;
  solution: string;
  sourcePdf?: string;
}

export type QuizMode = 'practice' | 'exam';

export type FilterStatus = 'all' | 'unanswered' | 'incorrect' | 'correct' | 'bookmarked';

export interface QuizStats {
  total: number;
  answered: number;
  correct: number;
  incorrect: number;
  percentage: number;
}
