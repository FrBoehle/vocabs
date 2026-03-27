import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button, Dialog, Input, Paragraph, SizableText, TextArea, XStack, YStack } from 'tamagui';

import { useCardStore } from '../../src/features/cards/store/cardStore';
import { FlipSwipeCard } from '../../src/features/cards/ui/FlipSwipeCard';

export default function StudyScreen() {
  const navigation = useNavigation();
  const currentIndex = useCardStore((state) => state.currentIndex);
  const cards = useCardStore((state) => state.cards);
  const swipeCurrentCard = useCardStore((state) => state.swipeCurrentCard);
  const addCard = useCardStore((state) => state.addCard);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const currentCard = cards[currentIndex];
  const progress = useMemo(() => {
    if (cards.length === 0) {
      return 0;
    }

    return (currentIndex + 1) / cards.length;
  }, [cards.length, currentIndex]);

  const progressValue = useSharedValue(0);

  useEffect(() => {
    progressValue.value = withTiming(progress, {
      duration: 360,
      easing: Easing.out(Easing.cubic),
    });
  }, [progress, progressValue]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button size="$2" marginRight="$2" onPress={() => setIsDialogOpen(true)}>
          Add Word
        </Button>
      ),
    });
  }, [navigation]);

  const handleAddCard = () => {
    if (!frontText.trim() || !backText.trim()) {
      setFormError('Please fill in German and Assyrian.');
      return;
    }

    addCard({
      frontText,
      backText,
      notes,
    });

    setFrontText('');
    setBackText('');
    setNotes('');
    setFormError(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <Dialog modal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay key="overlay" />
          <Dialog.Content
            key="content"
            bordered
            elevate
            gap="$3"
            maxWidth={520}
            width="92%"
            backgroundColor="#FFFFFF"
          >
            <Dialog.Title color="#0F172A">Add New Word</Dialog.Title>
            <Dialog.Description color="#334155">
              Create a new card for the German to Assyrian deck.
            </Dialog.Description>

            <Input
              placeholder="German"
              placeholderTextColor="$gray10"
              color="#0F172A"
              value={frontText}
              onChangeText={(value) => {
                setFrontText(value);
                if (formError) {
                  setFormError(null);
                }
              }}
            />
            <Input
              placeholder="Assyrian"
              placeholderTextColor="$gray10"
              color="#0F172A"
              value={backText}
              onChangeText={(value) => {
                setBackText(value);
                if (formError) {
                  setFormError(null);
                }
              }}
            />
            <TextArea
              placeholder="Optional notes"
              placeholderTextColor="$gray10"
              color="#0F172A"
              value={notes}
              onChangeText={setNotes}
              minHeight={90}
            />

            {formError ? (
              <Paragraph color="#B91C1C">
                {formError}
              </Paragraph>
            ) : null}

            <XStack gap="$2" justifyContent="flex-end">
              <Dialog.Close asChild>
                <Button>Cancel</Button>
              </Dialog.Close>
              <Button onPress={handleAddCard}>
                Save
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }}>
        <YStack gap="$3">
          <YStack gap="$2" borderRadius="$4" padding="$3" borderWidth={1}>
            <XStack justifyContent="space-between">
              <Paragraph opacity={0.7}>
                Deck progress
              </Paragraph>
              <Paragraph opacity={0.7}>
                {Math.round(progress * 100)}%
              </Paragraph>
            </XStack>
            <YStack height={10} borderRadius={999} overflow="hidden">
              <Animated.View style={[{ height: '100%', backgroundColor: '#0EA5E9' }, progressStyle]} />
            </YStack>
            <Paragraph opacity={0.65}>
              {cards.length > 0 ? `Card ${currentIndex + 1} of ${cards.length}` : 'No cards yet. Add your first card.'}
            </Paragraph>
          </YStack>
        </YStack>

        {currentCard ? (
          <FlipSwipeCard card={currentCard} onSwiped={swipeCurrentCard} />
        ) : (
          <YStack alignItems="center" justifyContent="center" borderRadius="$5" padding="$6" borderWidth={1}>
            <SizableText size="$8" fontWeight="700">
              No cards in your deck
            </SizableText>
            <Paragraph opacity={0.7} textAlign="center" marginTop="$2">
              Tap Add Word in the top-right header to create your first custom card.
            </Paragraph>
          </YStack>
        )}
      </ScrollView>
    </>
  );
}
