import { ScrollView } from 'react-native';
import { Button, H2, ListItem, Paragraph, SizableText, YStack } from 'tamagui';

import { useCardStore } from '../../src/features/cards/store/cardStore';

export default function SettingsScreen() {
  const resetSession = useCardStore((state) => state.resetSession);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <YStack gap="$4" borderRadius="$5" padding="$5" borderWidth={1}>
        <H2>Settings</H2>
        <Paragraph opacity={0.8}>
          This MVP is offline-first with demo data. You can reset your progress anytime.
        </Paragraph>

        <YStack gap="$2">
          <SizableText fontWeight="700">
            Owned Language Packs
          </SizableText>
          <ListItem opacity={0.75}>
            German to Assyrian
          </ListItem>
        </YStack>

        <Button onPress={resetSession}>
          Reset Progress
        </Button>

        <YStack gap="$2" marginTop="$2" borderTopWidth={1} paddingTop="$3">
          <SizableText fontWeight="700">
            About
          </SizableText>
          <Paragraph opacity={0.75}>
            Franz Böhle, 2026
          </Paragraph>
          <Paragraph opacity={0.6}>
            Version 1.0.0
          </Paragraph>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
