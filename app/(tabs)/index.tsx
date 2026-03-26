import { useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useProgressStore } from '../../src/store/progressStore';
import assyrianDeck from '../../src/data/assyrianDeck.json';

export default function DashboardScreen() {
  const { totalCards, learnedDeck, reviewDeck, setTotalCards, resetProgress } = useProgressStore();

  useEffect(() => {
    setTotalCards(assyrianDeck.length);
  }, []);

  const progressPercentage = totalCards > 0 ? (learnedDeck.length / totalCards) * 100 : 0;

  return (
    <View className="flex-1 bg-gray-50 p-6 pt-12">
      <Text className="text-3xl font-bold text-gray-800 mb-8">Shlama! 👋</Text>
      
      <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">My Progress</Text>
        
        {/* Progress Bar */}
        <View className="w-full h-4 bg-gray-200 rounded-full overflow-hidden my-4">
          <View 
            className="h-full bg-green-500 rounded-full" 
            style={{ width: `${progressPercentage}%` }} 
          />
        </View>
        <Text className="text-gray-500 text-right font-medium">{Math.round(progressPercentage)}% Mastery</Text>
      </View>

      <View className="flex-row justify-between mb-8">
        <View className="bg-blue-50 flex-1 p-4 rounded-2xl mr-2 items-center">
          <Text className="text-blue-600 font-bold text-3xl">{totalCards}</Text>
          <Text className="text-blue-800 font-medium mt-1 text-center">Total Cards</Text>
        </View>
        
        <View className="bg-green-50 flex-1 p-4 rounded-2xl mx-1 items-center">
          <Text className="text-green-600 font-bold text-3xl">{learnedDeck.length}</Text>
          <Text className="text-green-800 font-medium mt-1 text-center">Mastered</Text>
        </View>

        <View className="bg-red-50 flex-1 p-4 rounded-2xl ml-2 items-center">
          <Text className="text-red-500 font-bold text-3xl">{reviewDeck.length}</Text>
          <Text className="text-red-800 font-medium mt-1 text-center">To Review</Text>
        </View>
      </View>

      <Pressable 
        onPress={resetProgress}
        className="mt-auto bg-gray-200 py-4 rounded-2xl items-center"
      >
        <Text className="text-gray-600 font-bold text-lg">Reset Progress</Text>
      </Pressable>
    </View>
  );
}
