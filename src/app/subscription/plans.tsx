import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Crown, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, layout } from '@/theme';
import { PlanCard } from '@/components/subscription';
import { GradientBackground, HeaderIconButton } from '@/components/ui';

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
    <GradientBackground>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <View style={styles.container}>
          <View style={styles.header}>
            <HeaderIconButton onPress={() => router.back()}>
              <X size={24} color={colors.text.primary} />
            </HeaderIconButton>
            <Text style={styles.title}>Wybierz plan</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <LinearGradient
                colors={['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.05)']}
                style={styles.heroGradient}
              >
                <Crown size={48} color={colors.gold} />
                <Text style={styles.heroTitle}>Podróżuj bez limitów</Text>
                <Text style={styles.heroSubtitle}>
                  Odblokuj pełen potencjał AI i planuj wymarzone podróże
                </Text>
              </LinearGradient>
            </View>

            {/* Plans */}
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

            {/* Guarantee */}
            <View style={styles.guaranteeSection}>
              <Sparkles size={20} color={colors.green.primary} />
              <Text style={styles.guaranteeText}>
                7 dni gwarancji zwrotu pieniędzy. Anuluj w dowolnym momencie.
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  title: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: spacing[8],
    gap: spacing[6],
  },
  heroSection: {
    marginBottom: spacing[2],
  },
  heroGradient: {
    alignItems: 'center',
    padding: spacing[6],
    borderRadius: layout.radius.xl,
    gap: spacing[3],
  },
  heroTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    textAlign: 'center',
  },
  heroSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    maxWidth: 280,
  },
  plansContainer: {
    gap: spacing[4],
  },
  guaranteeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[4],
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: layout.radius.lg,
  },
  guaranteeText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
    flex: 1,
  },
});

