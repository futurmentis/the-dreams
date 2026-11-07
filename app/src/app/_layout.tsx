import { DMSans_400Regular, DMSans_500Medium, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans';
import { Literata_400Regular, Literata_500Medium } from '@expo-google-fonts/literata';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { Colors } from '@/constants/theme';
import { StoreProvider, useStore } from '@/data/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Literata_400Regular,
    Literata_500Medium,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });

  if (!loaded) return null;

  return (
    <StoreProvider>
      <StatusBar style="light" />
      <Screens />
    </StoreProvider>
  );
}

function Screens() {
  const { ready, hasPassword, unlocked, prepared } = useStore();
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);
  if (!ready) return null;
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Protected guard={unlocked}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="dream/[id]" />
        <Stack.Screen name="edit/[id]" />
        <Stack.Screen name="filter" />
        <Stack.Screen name="export-md" />
        <Stack.Screen name="transfer" />
        <Stack.Screen name="import-review" />
        <Stack.Screen name="bulk-themes" />
        <Stack.Screen name="change-password" />
      </Stack.Protected>
      <Stack.Protected guard={!unlocked && hasPassword}>
        <Stack.Screen name="lock" />
        <Stack.Screen name="restore-password" />
      </Stack.Protected>
      <Stack.Protected guard={!hasPassword}>
        <Stack.Screen name="setup-password" />
      </Stack.Protected>
      <Stack.Protected guard={unlocked || prepared !== null}>
        <Stack.Screen name="recovery-code" />
      </Stack.Protected>
    </Stack>
  );
}
