import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardItem = {
  id: string;
  assyrian: string;
  english: string;
  phonetic: string;
};

type ProgressState = {
  totalCards: number;
  learnedDeck: string[]; // array of Learned card IDs
  reviewDeck: string[]; // array of Review card IDs
  markAsLearned: (id: string) => void;
  markForReview: (id: string) => void;
  resetProgress: () => void;
  setTotalCards: (count: number) => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      totalCards: 0,
      learnedDeck: [],
      reviewDeck: [],
      
      setTotalCards: (count) => set({ totalCards: count }),
      
      markAsLearned: (id) => set((state) => ({
        learnedDeck: state.learnedDeck.includes(id) ? state.learnedDeck : [...state.learnedDeck, id],
        reviewDeck: state.reviewDeck.filter(cardId => cardId !== id)
      })),

      markForReview: (id) => set((state) => ({
        reviewDeck: state.reviewDeck.includes(id) ? state.reviewDeck : [...state.reviewDeck, id],
        learnedDeck: state.learnedDeck.filter(cardId => cardId !== id)
      })),

      resetProgress: () => set({ learnedDeck: [], reviewDeck: [] })
    }),
    {
      name: 'assyrian-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
