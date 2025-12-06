import { Stack } from 'expo-router';
import { colors } from '@/theme';

export default function CreatorStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        contentStyle: { backgroundColor: colors.background.primary },
      }}
    >
      <Stack.Screen name="index" />
      {/* Kolejne kroki będą tutaj lub jako parametry w index? Lepiej osobne ekrany dla stacka */}
      <Stack.Screen name="dates" />
      <Stack.Screen name="budget" />
      <Stack.Screen name="interests" />
      <Stack.Screen name="notes" />
      <Stack.Screen name="generating" options={{ presentation: 'fullScreenModal' }} />
    </Stack>
  );
}

