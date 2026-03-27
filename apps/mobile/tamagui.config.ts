import { config as defaultConfig } from '@tamagui/config/v3';
import { createFont, createTamagui } from 'tamagui';

const notoSansFont = createFont({
  family: 'NotoSans_400Regular',
  size: defaultConfig.fonts.body.size,
  lineHeight: defaultConfig.fonts.body.lineHeight,
  weight: {
    1: '400',
    2: '400',
    3: '400',
    4: '400',
    5: '500',
    6: '600',
    7: '600',
    8: '700',
    9: '700',
  },
  letterSpacing: defaultConfig.fonts.body.letterSpacing,
  face: {
    400: { normal: 'NotoSans_400Regular' },
    500: { normal: 'NotoSans_500Medium' },
    600: { normal: 'NotoSans_600SemiBold' },
    700: { normal: 'NotoSans_700Bold' },
    800: { normal: 'NotoSans_800ExtraBold' },
  },
});

const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    defaultFont: 'body',
  },
  fonts: {
    ...defaultConfig.fonts,
    heading: notoSansFont,
    body: notoSansFont,
  },
});

export type AppTamaguiConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppTamaguiConfig {}
}

export default config;
