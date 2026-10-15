import { Question } from '../types/quiz';

export const getQuestionCorrectKeys = (
  question: Pick<Question, 'correctKeys' | 'correctAnswer'>
): string[] => {
  if (question.correctKeys && question.correctKeys.length > 0) {
    return question.correctKeys.map((k) => k.trim().toLowerCase());
  }
  if (question.correctAnswer) {
    return question.correctAnswer
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
};

export const normalizeSelectedAnswer = (
  answer: string | string[] | undefined
): string[] => {
  if (!answer) return [];
  if (Array.isArray(answer)) {
    return answer.map((k) => k.trim().toLowerCase()).filter(Boolean);
  }
  return answer
    .split(',')
    .map((k) => k.trim().toLowerCase())
    .filter(Boolean);
};

export interface AnswerEvaluation {
  isAnswered: boolean;
  isCorrect: boolean;
  isPartiallyCorrect: boolean;
  hasWrongSelection: boolean;
  isMsq: boolean;
  correctKeys: string[];
  selectedKeys: string[];
}

export const evaluateAnswer = (
  question: Pick<Question, 'correctKeys' | 'correctAnswer'>,
  selectedAnswer: string | string[] | undefined
): AnswerEvaluation => {
  const correctKeys = getQuestionCorrectKeys(question);
  const selectedKeys = normalizeSelectedAnswer(selectedAnswer);
  const isMsq = correctKeys.length > 1;
  const isAnswered = selectedKeys.length > 0;

  if (!isAnswered) {
    return {
      isAnswered: false,
      isCorrect: false,
      isPartiallyCorrect: false,
      hasWrongSelection: false,
      isMsq,
      correctKeys,
      selectedKeys,
    };
  }

  const hasWrongSelection = selectedKeys.some((k) => !correctKeys.includes(k));
  const hasAllCorrectSelected =
    correctKeys.length > 0 &&
    correctKeys.every((k) => selectedKeys.includes(k));

  const isCorrect = !hasWrongSelection && hasAllCorrectSelected;
  const isPartiallyCorrect = isMsq && !hasWrongSelection && !hasAllCorrectSelected;

  return {
    isAnswered: true,
    isCorrect,
    isPartiallyCorrect,
    hasWrongSelection,
    isMsq,
    correctKeys,
    selectedKeys,
  };
};
