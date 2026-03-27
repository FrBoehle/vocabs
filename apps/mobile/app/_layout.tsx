import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AppProviders } from '../src/core/providers/AppProviders';
import { useAppTheme } from '../src/core/theme/useAppTheme';

export default function RootLayout() {
  const { isDark } = useAppTheme();

  return (
    <AppProviders>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
