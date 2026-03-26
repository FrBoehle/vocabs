import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SwipeableCard } from '../../src/features/flashcards/components/SwipeableCard';
import assyrianDeck from '../../src/data/assyrianDeck.json';
import { useProgressStore, CardItem } from '../../src/store/progressStore';

export default function LearnScreen() {
  const [currentDeck, setCurrentDeck] = useState<CardItem[]>([]);
  const { markAsLearned, markForReview, learnedDeck } = useProgressStore();

  useEffect(() => {
    // Filter out cards we've already learned for this session
    const cardsToLearn = (assyrianDeck as CardItem[]).filter(card => !learnedDeck.includes(card.id));
    setCurrentDeck(cardsToLearn);
  }, [learnedDeck]);

  const handleSwipeRight = (card: CardItem) => {
    markAsLearned(card.id);
  };

  const handleSwipeLeft = (card: CardItem) => {
    markForReview(card.id);
    // Put it back at the end of the current deck
    setTimeout(() => {
      setCurrentDeck(prev => {
        const nextDeck = [...prev.filter(c => c.id !== card.id), card];
        return nextDeck;
      });
    }, 300);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-50 items-center justify-center pt-8">
        {currentDeck.length > 0 ? (
          <View className="relative w-full flex-1 items-center justify-center">
            {/* Render top 3 cards for stack effect (reversed for correct z-index visual) */}
            {currentDeck
              .slice(0, 3)
              .reverse()
              .map((card, index, array) => {
                const isTopCard = index === array.length - 1;
                return (
                  <View 
                    key={card.id} 
                    style={{ position: 'absolute', pointerEvents: isTopCard ? 'auto' : 'none' }}
                  >
                    <SwipeableCard
                      card={card}
                      onSwipeLeft={handleSwipeLeft}
                      onSwipeRight={handleSwipeRight}
                    />
                  </View>
                );
              })}
          </View>
        ) : (
          <View className="items-center justify-center p-8">
            <Text className="text-4xl mb-4">🎉</Text>
            <Text className="text-2xl font-bold text-gray-800 text-center mb-2">You did it!</Text>
            <Text className="text-gray-500 text-center mb-8">You've mastered this deck.</Text>
            
            <Link href="/" className="bg-blue-600 px-8 py-4 rounded-full">
              <Text className="text-white font-bold text-lg">Back to Dashboard</Text>
            </Link>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}
