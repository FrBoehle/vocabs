import { Card, Paragraph, SizableText, XStack, YStack } from 'tamagui';

type Props = {
  label: string;
  value: string;
  tint: string;
};

export function KpiTile({ label, value, tint }: Props) {
  return (
    <Card width="48%" padding="$4" borderRadius="$4" borderWidth={1}>
      <YStack gap="$2">
        <Paragraph opacity={0.7} fontSize={13}>
          {label}
        </Paragraph>
        <XStack alignItems="baseline" gap="$2">
          <SizableText color={tint} size="$9" fontWeight="700">
            {value}
          </SizableText>
        </XStack>
      </YStack>
    </Card>
  );
}
