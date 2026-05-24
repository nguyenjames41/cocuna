import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  useFonts as useDMSans,
} from '@expo-google-fonts/dm-sans';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
  useFonts as useFraunces,
} from '@expo-google-fonts/fraunces';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Cocuna } from '@/constants/theme';
import { useDemoState } from '@/lib/demo-state';

export default function RootLayout() {
  const [dmSansLoaded] = useDMSans({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
  });
  const [frauncesLoaded] = useFraunces({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
  });

  if (!dmSansLoaded || !frauncesLoaded) {
    return <View style={{ flex: 1, backgroundColor: Cocuna.bg }} />;
  }

  return (
    <SafeAreaProvider>
      <OnboardingGate />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Cocuna.bg },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="chat"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="care-plan"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="companion"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="jane-silence"
          options={{ animation: 'slide_from_right' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

function OnboardingGate() {
  const router = useRouter();
  const segments = useSegments();
  const hasOnboarded = useDemoState().hasOnboarded;

  useEffect(() => {
    const onOnboarding = segments[0] === 'onboarding';
    if (!hasOnboarded && !onOnboarding) {
      router.replace('/onboarding');
    }
  }, [hasOnboarded, router, segments]);

  return null;
}
