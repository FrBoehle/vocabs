import { ScrollView } from 'react-native';
import { H2, Paragraph, SizableText, XStack, YStack } from 'tamagui';

import { calculateMastery, countDueCards } from '../../src/domain/services/spacedRepetition';
import { useCardStore } from '../../src/features/cards/store/cardStore';
import { KpiTile } from '../../src/features/dashboard/ui/KpiTile';

export default function DashboardScreen() {
  const cards = useCardStore((state) => state.cards);
  const learnedToday = useCardStore((state) => state.learnedToday);
  const streakDays = useCardStore((state) => state.streakDays);

  const stats = {
    learnedToday,
    dueToday: countDueCards(cards),
    currentStreak: streakDays,
    totalCards: cards.length,
    masteryPercent: calculateMastery(cards),
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <YStack gap="$2" padding="$5" borderWidth={1} borderRadius="$5">
        <YStack gap="$2" flex={1}>
          <Paragraph>
            vocabs
          </Paragraph>
          <H2>Welcome back, Franz</H2>
        </YStack>

        <SizableText size="$5">
          Keep your streak alive and master today&apos;s cards.
        </SizableText>
      </YStack>

      <XStack flexWrap="wrap" justifyContent="space-between" rowGap={12}>
        <KpiTile label="Learned today" value={String(stats.learnedToday)} tint="$blue10" />
        <KpiTile label="Due today" value={String(stats.dueToday)} tint="$red10" />
        <KpiTile label="Current streak" value={`${stats.currentStreak} days`} tint="$green10" />
        <KpiTile label="Total cards" value={String(stats.totalCards)} tint="$gray11" />
      </XStack>

      <YStack borderRadius="$5" padding="$5" borderWidth={1} gap="$2">
        <Paragraph opacity={0.7}>
          Mastery
        </Paragraph>
        <SizableText size="$10" fontWeight="800">
          {stats.masteryPercent}%
        </SizableText>
        <Paragraph opacity={0.8}>
          Reach 80% mastery to unlock advanced deck generation in the next milestone.
        </Paragraph>
      </YStack>
    </ScrollView>
  );
}
