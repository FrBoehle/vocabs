export type SwipeOutcome = 'known' | 'review';

export type SpacedRepetitionState = {
  interval: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
};

export type AssyrianCard = {
  id: string;
  deckId: string;
  frontText: string;
  backText: string;
  notes?: string;
  spacedRep: SpacedRepetitionState;
  lastOutcome?: SwipeOutcome;
};

export type DashboardStats = {
  learnedToday: number;
  dueToday: number;
  currentStreak: number;
  totalCards: number;
  masteryPercent: number;
};
