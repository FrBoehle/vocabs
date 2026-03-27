import { useEffect, useMemo, useState } from 'react';
import { Dimensions, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Button, Paragraph, SizableText, XStack, YStack } from 'tamagui';

import { AssyrianCard, SwipeOutcome } from '../../../domain/types/cards';

const SWIPE_THRESHOLD = 120;
const FLIP_SWIPE_DISTANCE = 140;
const FLIP_COMPLETE_THRESHOLD = 72;
const CARD_WIDTH = Math.min(Dimensions.get('window').width - 32, 420);

type Props = {
  card: AssyrianCard;
  onSwiped: (outcome: SwipeOutcome) => void;
};

export function FlipSwipeCard({ card, onSwiped }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const knownGradientColors = isDark
    ? (['#052E16', '#166534'] as const)
    : (['#ECFDF3', '#86EFAC'] as const);
  const reviewGradientColors = isDark
    ? (['#450A0A', '#991B1B'] as const)
    : (['#FEF2F2', '#FCA5A5'] as const);
  const knownLabelColor = isDark ? '#DCFCE7' : '#14532D';
  const reviewLabelColor = isDark ? '#FEE2E2' : '#7F1D1D';

  const flip = useSharedValue(0);
  const translateX = useSharedValue(0);
  const entryOpacity = useSharedValue(1);
  const entryTranslateY = useSharedValue(0);
  const entryScale = useSharedValue(1);

  useEffect(() => {
    // Animate each incoming card so the next prompt feels alive after a swipe.
    entryOpacity.value = 0;
    entryTranslateY.value = 22;
    entryScale.value = 0.97;

    entryOpacity.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.ease) });
    entryTranslateY.value = withTiming(0, { duration: 240, easing: Easing.out(Easing.ease) });
    entryScale.value = withTiming(1, { duration: 240, easing: Easing.out(Easing.ease) });
  }, [card.id, entryOpacity, entryScale, entryTranslateY]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    const rotate = interpolate(translateX.value, [-220, 220], [-11, 11], Extrapolation.CLAMP);

    return {
      opacity: entryOpacity.value,
      transform: [
        { translateY: entryTranslateY.value },
        { scale: entryScale.value },
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const frontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flip.value, [0, 90], [1, 0]),
    transform: [{ rotateY: `${flip.value}deg` }],
  }));

  const backStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flip.value, [90, 180], [0, 1]),
    transform: [{ rotateY: `${flip.value + 180}deg` }],
  }));

  const canSwipeHint = useMemo(
    () => (isFlipped ? 'Swipe right if known, left to review.' : 'Tap or swipe to flip.'),
    [isFlipped]
  );

  const completeSwipe = (outcome: SwipeOutcome) => {
    onSwiped(outcome);
    setIsFlipped(false);
    flip.value = 0;
    translateX.value = 0;
  };

  const setFlipState = (nextFlipped: boolean) => {
    setIsFlipped(nextFlipped);
    flip.value = withTiming(nextFlipped ? 180 : 0, {
      duration: 350,
      easing: Easing.bezier(0.2, 0.7, 0.2, 1),
    });
  };

  const toggleFlip = () => {
    setFlipState(!isFlipped);
  };

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (!isFlipped) {
        const progress = Math.min(Math.abs(event.translationX) / FLIP_SWIPE_DISTANCE, 1);
        flip.value = progress * 180;
        translateX.value = 0;
        return;
      }

      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (!isFlipped) {
        const shouldCompleteFlip = Math.abs(event.translationX) > FLIP_COMPLETE_THRESHOLD || flip.value > 96;

        if (shouldCompleteFlip) {
          flip.value = withTiming(180, {
            duration: 220,
            easing: Easing.out(Easing.ease),
          });
          runOnJS(setIsFlipped)(true);
          return;
        }

        flip.value = withTiming(0, {
          duration: 220,
          easing: Easing.out(Easing.ease),
        });
        runOnJS(setIsFlipped)(false);
        return;
      }

      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(420, { duration: 220, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(completeSwipe)('known');
        });
        return;
      }

      if (translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-420, { duration: 220, easing: Easing.out(Easing.ease) }, () => {
          runOnJS(completeSwipe)('review');
        });
        return;
      }

      translateX.value = withSpring(0, { damping: 15, stiffness: 160 });
    });

  const tap = Gesture.Tap().onEnd((_event, success) => {
    if (success) {
      runOnJS(toggleFlip)();
    }
  });

  const goodStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 0.9], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0.9, 1.05], Extrapolation.CLAMP) }],
  }));

  const badStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [0.9, 0], Extrapolation.CLAMP),
    transform: [{ scale: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1.05, 0.9], Extrapolation.CLAMP) }],
  }));

  const greenGradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP),
  }));

  const redGradientStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP),
  }));

  return (
    <YStack gap="$3" alignItems="center">
      <GestureDetector gesture={Gesture.Exclusive(pan, tap)}>
        <Animated.View style={animatedContainerStyle}>
          <YStack
            width={CARD_WIDTH}
            minHeight={420}
            padding="$6"
            borderRadius="$5"
            borderWidth={1}
            backgroundColor="$background"
            overflow="hidden"
            justifyContent="space-between"
          >
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
                greenGradientStyle,
              ]}
            >
              <LinearGradient colors={knownGradientColors} style={{ flex: 1 }} />
            </Animated.View>

            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                },
                redGradientStyle,
              ]}
            >
              <LinearGradient colors={reviewGradientColors} style={{ flex: 1 }} />
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 20,
                  left: 20,
                },
                goodStyle,
              ]}
            >
              <SizableText size="$8" fontWeight="700" color={knownLabelColor}>
                KNOWN
              </SizableText>
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  top: 20,
                  right: 20,
                },
                badStyle,
              ]}
            >
              <SizableText size="$8" fontWeight="700" color={reviewLabelColor}>
                REVIEW
              </SizableText>
            </Animated.View>

            <Animated.View style={[{ backfaceVisibility: 'hidden' }, frontStyle]}>
              <Paragraph opacity={0.75}>
                German
              </Paragraph>
              <SizableText size="$10" fontWeight="700" fontFamily="$body">
                {card.frontText}
              </SizableText>
            </Animated.View>

            <Animated.View
              style={[
                {
                  position: 'absolute',
                  left: 24,
                  right: 24,
                  top: 96,
                  backfaceVisibility: 'hidden',
                },
                backStyle,
              ]}
            >
              <Paragraph opacity={0.75} fontFamily="$body">
                Assyrian
              </Paragraph>
              <SizableText size="$10" fontWeight="700" fontFamily="$body">
                {card.backText}
              </SizableText>
            </Animated.View>

            <XStack justifyContent="flex-end" alignItems="center" marginTop="auto">
              <Paragraph opacity={0.7} maxWidth={220} textAlign="right">
                {canSwipeHint}
              </Paragraph>
            </XStack>
          </YStack>
        </Animated.View>
      </GestureDetector>

      {isFlipped && card.notes?.trim() ? (
        <YStack width={CARD_WIDTH} borderRadius="$4" borderWidth={1} padding="$3" backgroundColor="$background">
          <Paragraph opacity={0.7}>
            Notes
          </Paragraph>
          <Paragraph marginTop="$1" fontFamily="$body">
            {card.notes}
          </Paragraph>
        </YStack>
      ) : null}

      {isFlipped ? (
        <XStack gap="$3">
          <Button
            theme="red"
            onPress={() => {
              completeSwipe('review');
            }}
          >
            Need Review
          </Button>
          <Button
            theme="green"
            onPress={() => {
              completeSwipe('known');
            }}
          >
            Learned Well
          </Button>
        </XStack>
      ) : null}
    </YStack>
  );
}
