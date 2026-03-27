import { create } from 'zustand';

import { demoAssyrianCards } from '../../../data/demo/assyrianCards';
import { calculateNextReview } from '../../../domain/services/spacedRepetition';
import { AssyrianCard, SwipeOutcome, WordType } from '../../../domain/types/cards';
import { addDays } from '../../../utils/date';

type NewCardInput = {
  frontText: string;
  backText: string;
  wordType: WordType;
  notes?: string;
};

export type AppThemePreference = 'system' | 'light' | 'dark';

type CardState = {
  cards: AssyrianCard[];
  currentIndex: number;
  selectedWordTypes: WordType[];
  learnedToday: number;
  reviewedToday: number;
  streakDays: number;
  themePreference: AppThemePreference;
  toggleWordTypeFilter: (wordType: WordType) => void;
  swipeCurrentCard: (outcome: SwipeOutcome) => void;
  addCard: (cardInput: NewCardInput) => void;
  setThemePreference: (preference: AppThemePreference) => void;
  resetSession: () => void;
};

const seededCards = demoAssyrianCards.map((card) => ({ ...card }));

function pickRandomIndexByTypes(cards: AssyrianCard[], wordTypes: WordType[], excludeIndex?: number): number {
  const candidates = cards
    .map((card, index) => ({ card, index }))
    .filter(
      ({ card, index }) => wordTypes.includes(card.wordType) && (excludeIndex === undefined || index !== excludeIndex)
    );

  if (candidates.length === 0) {
    return excludeIndex ?? 0;
  }

  const randomPick = candidates[Math.floor(Math.random() * candidates.length)];
  return randomPick.index;
}

export const useCardStore = create<CardState>((set, get) => ({
  cards: seededCards,
  currentIndex: pickRandomIndexByTypes(seededCards, ['nouns']),
  selectedWordTypes: ['nouns'],
  learnedToday: 0,
  reviewedToday: 0,
  streakDays: 1,
  themePreference: 'system',
  toggleWordTypeFilter: (wordType) => {
    const { cards, selectedWordTypes } = get();
    const isSelected = selectedWordTypes.includes(wordType);
    const nextSelectedWordTypes = isSelected
      ? selectedWordTypes.filter((item) => item !== wordType)
      : [...selectedWordTypes, wordType];

    const ensuredSelectedWordTypes = nextSelectedWordTypes.length > 0 ? nextSelectedWordTypes : [wordType];

    set({
      selectedWordTypes: ensuredSelectedWordTypes,
      currentIndex: pickRandomIndexByTypes(cards, ensuredSelectedWordTypes),
    });
  },
  swipeCurrentCard: (outcome) => {
    const { cards, currentIndex, selectedWordTypes, learnedToday, reviewedToday } = get();
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

    const filteredCount = nextCards.filter((card) => selectedWordTypes.includes(card.wordType)).length;
    const nextIndex =
      filteredCount > 1
        ? pickRandomIndexByTypes(nextCards, selectedWordTypes, currentIndex)
        : pickRandomIndexByTypes(nextCards, selectedWordTypes);

    set({
      cards: nextCards,
      currentIndex: nextIndex,
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
      wordType: cardInput.wordType,
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
  setThemePreference: (themePreference) => {
    set({ themePreference });
  },
  resetSession: () => {
    const resetCards = demoAssyrianCards.map((card) => ({ ...card }));
    set({
      cards: resetCards,
      selectedWordTypes: ['nouns'],
      currentIndex: pickRandomIndexByTypes(resetCards, ['nouns']),
      learnedToday: 0,
      reviewedToday: 0,
      streakDays: 1,
    });
  },
}));
