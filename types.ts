export interface Question {
  id: string;
  text: string;
  options: string[]; // Limit to 2 for this requirement
  correctIndex: number;
}

export interface AppConfig {
  title: string;
  questions: Question[];
  wheelColors: string[];
  maxQuestions: number; // 0 means "All"
}

export interface GameState {
  answeredIds: string[]; // IDs of correctly answered questions (or just finished ones)
  score: number;
  history: { questionId: string; isCorrect: boolean }[];
}

export type ViewMode = 'wheel' | 'grid';
export type GamePhase = 'playing' | 'ended';
