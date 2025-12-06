import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { PlanCard } from '@/components/subscription';
import { TouchableOpacity } from 'react-native';

const PLANS = [
  {
    id: 'free',
    title: 'Free',
    price: '0 zł',
    features: ['3 plany podróży miesięcznie', 'Podstawowe rekomendacje', 'Reklamy w aplikacji'],
    buttonLabel: 'Twój obecny plan',
    isCurrent: true,
  },
  {
    id: 'premium',
    title: 'Premium',
    price: '29 zł',
    isPopular: true,
    features: ['Nielimitowane plany', 'Zaawansowany asystent AI', 'Brak reklam', 'Eksport do PDF', 'Zapisywanie offline'],
    buttonLabel: 'Rozpocznij 7 dni za darmo',
  },
  {
    id: 'pro',
    title: 'Pro',
    price: '49 zł',
    features: ['Wszystko co w Premium', 'Osobisty konsjerż 24/7', 'Automatyczne rezerwacje', 'Wsparcie priorytetowe'],
    buttonLabel: 'Wybierz Pro',
  },
];

export default function SubscriptionPlansScreen() {
  const router = useRouter();

  const handleSelect = (planId: string) => {
    console.log('Select plan', planId);
    // Implement stripe checkout logic here
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <X size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Wybierz swój plan</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.subtitle}>
            Odblokuj pełen potencjał TravelAI Guide i podróżuj bez ograniczeń.
          </Text>

          <View style={styles.plansContainer}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                title={plan.title}
                price={plan.price}
                features={plan.features}
                isPopular={plan.isPopular}
                buttonLabel={plan.buttonLabel}
                onPress={() => handleSelect(plan.id)}
              />
            ))}
          </View>
          
          <Text style={styles.disclaimer}>
            Możesz anulować subskrypcję w dowolnym momencie.
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.headerHeight,
  },
  closeButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: spacing[8],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  plansContainer: {
    gap: spacing[2],
  },
  disclaimer: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[4],
  },
});

