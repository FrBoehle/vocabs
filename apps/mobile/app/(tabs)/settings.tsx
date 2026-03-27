import { ScrollView } from 'react-native';
import { Button, H2, ListItem, Paragraph, SizableText, YStack, useTheme } from 'tamagui';

import { useCardStore } from '../../src/features/cards/store/cardStore';

export default function SettingsScreen() {
  const resetSession = useCardStore((state) => state.resetSession);
  const theme = useTheme();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background.val }} contentContainerStyle={{ padding: 16 }}>
      <YStack gap="$4" borderRadius="$5" padding="$5" borderWidth={1} backgroundColor="$backgroundHover">
        <H2>Settings</H2>
        <Paragraph color="$gray11">
          This MVP is offline-first with demo data. You can reset your progress anytime.
        </Paragraph>

        <YStack gap="$2">
          <SizableText fontWeight="700">
            Owned Language Packs
          </SizableText>
          <ListItem>
            <Paragraph color="$gray11">
              German to Assyrian
            </Paragraph>
          </ListItem>
        </YStack>

        <Button onPress={resetSession}>
          Reset Progress
        </Button>

        <YStack gap="$2" marginTop="$2" borderTopWidth={1} paddingTop="$3">
          <SizableText fontWeight="700">
            About
          </SizableText>
          <Paragraph color="$gray11">
            Franz Böhle, 2026
          </Paragraph>
          <Paragraph color="$gray10">
            Version 1.0.0
          </Paragraph>
        </YStack>
      </YStack>
    </ScrollView>
  );
}
