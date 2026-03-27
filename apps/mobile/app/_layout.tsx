import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { AppProviders } from '../src/core/providers/AppProviders';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProviders>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }} />
    </AppProviders>
  );
}
