import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from 'expo-router';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Button, Dialog, Input, Paragraph, SizableText, TextArea, XStack, YStack, useTheme } from 'tamagui';

import { useCardStore } from '../../src/features/cards/store/cardStore';
import { FlipSwipeCard } from '../../src/features/cards/ui/FlipSwipeCard';

const WORD_TYPES = ['nouns', 'adjectives', 'verbs'] as const;

export default function StudyScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  const currentIndex = useCardStore((state) => state.currentIndex);
  const cards = useCardStore((state) => state.cards);
  const selectedWordTypes = useCardStore((state) => state.selectedWordTypes);
  const toggleWordTypeFilter = useCardStore((state) => state.toggleWordTypeFilter);
  const reviewedToday = useCardStore((state) => state.reviewedToday);
  const swipeCurrentCard = useCardStore((state) => state.swipeCurrentCard);
  const addCard = useCardStore((state) => state.addCard);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredCards = useMemo(
    () => cards.filter((card) => selectedWordTypes.includes(card.wordType)),
    [cards, selectedWordTypes]
  );
  const currentCard = selectedWordTypes.includes(cards[currentIndex]?.wordType ?? 'nouns')
    ? cards[currentIndex]
    : filteredCards[0];
  const progress = useMemo(() => {
    if (filteredCards.length === 0) {
      return 0;
    }

    return Math.min((reviewedToday % filteredCards.length) / filteredCards.length, 1);
  }, [filteredCards.length, reviewedToday]);

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
      wordType: selectedWordTypes[0] ?? 'nouns',
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
            backgroundColor="$background"
          >
            <Dialog.Title>Add New Word</Dialog.Title>
            <Dialog.Description>
              Create a new card for the German to Assyrian deck.
            </Dialog.Description>

            <Input
              placeholder="German"
              placeholderTextColor="$gray10"
              color="$color"
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
              color="$color"
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
              color="$color"
              value={notes}
              onChangeText={setNotes}
              minHeight={90}
            />

            {formError ? (
              <Paragraph color="$red10">
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

      <ScrollView
        style={{ flex: 1, backgroundColor: theme.background.val }}
        contentContainerStyle={{ padding: 16, gap: 14 }}
      >
        <YStack gap="$3">
          <YStack gap="$2" borderRadius="$4" padding="$3" borderWidth={1} backgroundColor="$backgroundHover">
            <Paragraph color="$gray11">
              Word Type
            </Paragraph>
            <XStack gap="$2">
              {WORD_TYPES.map((wordType) => {
                const isSelected = selectedWordTypes.includes(wordType);

                return (
                  <Button
                    key={wordType}
                    flex={1}
                    variant={isSelected ? undefined : 'outlined'}
                    onPress={() => toggleWordTypeFilter(wordType)}
                  >
                    {wordType === 'nouns' ? 'Nouns' : wordType === 'adjectives' ? 'Adjectives' : 'Verbs'}
                  </Button>
                );
              })}
            </XStack>
          </YStack>

          <YStack gap="$2" borderRadius="$4" padding="$3" borderWidth={1} backgroundColor="$backgroundHover">
            <XStack justifyContent="space-between">
              <Paragraph color="$gray11">
                Deck progress
              </Paragraph>
              <Paragraph color="$gray11">
                {Math.round(progress * 100)}%
              </Paragraph>
            </XStack>
            <YStack height={10} borderRadius={999} overflow="hidden" backgroundColor="$gray5">
              <Animated.View style={[{ height: '100%', backgroundColor: theme.blue9.val }, progressStyle]} />
            </YStack>
            <Paragraph color="$gray11">
              {filteredCards.length > 0
                ? `${filteredCards.length} cards in ${selectedWordTypes.join(', ')}`
                : `No cards in selected filters yet.`}
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
            <Paragraph color="$gray11" textAlign="center" marginTop="$2">
              Tap Add Word in the top-right header to create your first custom card.
            </Paragraph>
          </YStack>
        )}
      </ScrollView>
    </>
  );
}
