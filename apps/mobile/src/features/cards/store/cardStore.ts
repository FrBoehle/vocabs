import { create } from 'zustand';

import { demoAssyrianCards } from '../../../data/demo/assyrianCards';
import { calculateNextReview } from '../../../domain/services/spacedRepetition';
import { AssyrianCard, SwipeOutcome } from '../../../domain/types/cards';
import { addDays } from '../../../utils/date';

type NewCardInput = {
  frontText: string;
  backText: string;
  notes?: string;
};

type CardState = {
  cards: AssyrianCard[];
  currentIndex: number;
  learnedToday: number;
  reviewedToday: number;
  streakDays: number;
  swipeCurrentCard: (outcome: SwipeOutcome) => void;
  addCard: (cardInput: NewCardInput) => void;
  resetSession: () => void;
};

const seededCards = demoAssyrianCards.map((card) => ({ ...card }));

export const useCardStore = create<CardState>((set, get) => ({
  cards: seededCards,
  currentIndex: 0,
  learnedToday: 0,
  reviewedToday: 0,
  streakDays: 1,
  swipeCurrentCard: (outcome) => {
    const { cards, currentIndex, learnedToday, reviewedToday } = get();
    const currentCard = cards[currentIndex];

    if (!currentCard) {
      return;
    }

    const updatedCard: AssyrianCard = {
      ...currentCard,
      lastOutcome: outcome,
      spacedRep: calculateNextReview(currentCard.spacedRep, outcome),
    };

    const nextCards = cards.map((card) => (card.id === updatedCard.id ? updatedCard : card));

    set({
      cards: nextCards,
      currentIndex: (currentIndex + 1) % nextCards.length,
      learnedToday: outcome === 'known' ? learnedToday + 1 : learnedToday,
      reviewedToday: reviewedToday + 1,
      streakDays: outcome === 'known' ? get().streakDays : Math.max(1, get().streakDays - 1),
    });
  },
  addCard: (cardInput) => {
    const now = new Date();
    const newCard: AssyrianCard = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      deckId: 'custom',
      frontText: cardInput.frontText.trim(),
      backText: cardInput.backText.trim(),
      notes: cardInput.notes?.trim() || undefined,
      spacedRep: {
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0,
        nextReviewDate: addDays(now, 0).toISOString(),
      },
    };

    set((state) => ({
      cards: [...state.cards, newCard],
    }));
  },
  resetSession: () => {
    set({
      cards: demoAssyrianCards.map((card) => ({ ...card })),
      currentIndex: 0,
      learnedToday: 0,
      reviewedToday: 0,
      streakDays: 1,
    });
  },
}));
