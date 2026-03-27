import { addDays, isBeforeOrEqualToday } from '../../utils/date';
import { AssyrianCard, SpacedRepetitionState, SwipeOutcome } from '../types/cards';

export function calculateNextReview(
  current: SpacedRepetitionState,
  outcome: SwipeOutcome,
  now = new Date()
): SpacedRepetitionState {
  if (outcome === 'review') {
    return {
      interval: 1,
      repetitions: 0,
      easeFactor: Math.max(1.3, current.easeFactor - 0.2),
      nextReviewDate: addDays(now, 1).toISOString(),
    };
  }

  const nextRepetitions = current.repetitions + 1;
  const nextInterval =
    nextRepetitions === 1
      ? 1
      : nextRepetitions === 2
      ? 3
      : Math.max(4, Math.round(current.interval * current.easeFactor));

  return {
    interval: nextInterval,
    repetitions: nextRepetitions,
    easeFactor: current.easeFactor + 0.1,
    nextReviewDate: addDays(now, nextInterval).toISOString(),
  };
}

export function calculateMastery(cards: AssyrianCard[]): number {
  if (cards.length === 0) {
    return 0;
  }

  const mastered = cards.filter((card) => card.spacedRep.repetitions >= 3).length;
  return Math.round((mastered / cards.length) * 100);
}

export function countDueCards(cards: AssyrianCard[]): number {
  return cards.filter((card) => isBeforeOrEqualToday(card.spacedRep.nextReviewDate)).length;
}
