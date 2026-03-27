import { useColorScheme } from 'react-native';

import { useCardStore } from '../../features/cards/store/cardStore';

export function useAppTheme() {
  const systemColorScheme = useColorScheme();
  const themePreference = useCardStore((state) => state.themePreference);

  const themeName =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  return {
    themePreference,
    themeName,
    isDark: themeName === 'dark',
  } as const;
}
