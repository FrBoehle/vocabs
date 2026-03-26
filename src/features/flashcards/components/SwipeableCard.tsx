import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
  Extrapolation,
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { CardItem } from '../../../store/progressStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.3;

type Props = {
  card: CardItem;
  onSwipeLeft: (card: CardItem) => void;
  onSwipeRight: (card: CardItem) => void;
};

export const SwipeableCard: React.FC<Props> = ({ card, onSwipeLeft, onSwipeRight }) => {
  const [flipped, setFlipped] = useState(false);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  
  // Animation for flip
  const flipRotation = useSharedValue(0);

  const flipCard = () => {
    setFlipped(!flipped);
    flipRotation.value = withSpring(flipped ? 0 : 180, { damping: 15 });
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flipRotation.value, [0, 180], [0, 180], Extrapolation.CLAMP);
    return {
      transform: [
        { rotateY: `${rotateValue}deg` }
      ],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateValue = interpolate(flipRotation.value, [0, 180], [180, 360], Extrapolation.CLAMP);
    return {
      transform: [
        { rotateY: `${rotateValue}deg` }
      ],
      backfaceVisibility: 'hidden',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotateValue.value = interpolate(
        event.translationX,
        [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        [-10, 0, 10],
        Extrapolation.CLAMP
      );
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe Right (Learned)
        translateX.value = withSpring(SCREEN_WIDTH * 1.5, { velocity: event.velocityX });
        runOnJS(onSwipeRight)(card);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe Left (Review)
        translateX.value = withSpring(-SCREEN_WIDTH * 1.5, { velocity: event.velocityX });
        runOnJS(onSwipeLeft)(card);
      } else {
        // Reset
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotateValue.value = withSpring(0);
      }
    });

  const swipeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotateValue.value}deg` },
    ],
  }));

  const overlayRightStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [0, SWIPE_THRESHOLD], [0, 1], Extrapolation.CLAMP);
    return { opacity };
  });

  const overlayLeftStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-SWIPE_THRESHOLD, 0], [1, 0], Extrapolation.CLAMP);
    return { opacity };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.cardContainer, swipeAnimatedStyle]} className="shadow-lg shadow-black/20 m-4">
        <Pressable onPress={flipCard} style={{ flex: 1 }}>
          {/* FRONT */}
          <Animated.View style={[styles.card, frontAnimatedStyle]} className="bg-white rounded-3xl p-6 justify-center items-center">
             <Text className="text-4xl font-bold text-gray-800 mb-2">{card.assyrian}</Text>
             <Text className="text-lg text-gray-400">Tap to reveal</Text>
             
             {/* Swiping Overlays */}
             <Animated.View style={[styles.overlay, overlayRightStyle, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]} className="rounded-3xl border-4 border-green-500 justify-center items-center">
                <Text className="text-green-600 font-bold text-4xl transform -rotate-12 uppercase">Got It!</Text>
             </Animated.View>

             <Animated.View style={[styles.overlay, overlayLeftStyle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]} className="rounded-3xl border-4 border-red-500 justify-center items-center">
                <Text className="text-red-600 font-bold text-4xl transform rotate-12 uppercase">Review</Text>
             </Animated.View>
          </Animated.View>
          
          {/* BACK */}
          <Animated.View style={[styles.card, backAnimatedStyle]} className="bg-white rounded-3xl p-6 justify-center items-center">
             <Text className="text-3xl font-bold text-blue-600 mb-2">{card.english}</Text>
             <Text className="text-xl text-gray-500 italic mt-4">{card.phonetic}</Text>
             <Text className="text-sm mt-8 text-gray-400">Swipe Right for 'Learned'</Text>
             <Text className="text-sm text-gray-400">Swipe Left for 'Review'</Text>
             
             <Animated.View style={[styles.overlay, overlayRightStyle, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]} className="rounded-3xl border-4 border-green-500 justify-center items-center">
                <Text className="text-green-600 font-bold text-4xl transform -rotate-12 uppercase">Got It!</Text>
             </Animated.View>

             <Animated.View style={[styles.overlay, overlayLeftStyle, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]} className="rounded-3xl border-4 border-red-500 justify-center items-center">
                <Text className="text-red-600 font-bold text-4xl transform rotate-12 uppercase">Review</Text>
             </Animated.View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: SCREEN_WIDTH * 0.85,
    height: SCREEN_WIDTH * 1.2,
    position: 'absolute',
  },
  card: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
  }
});