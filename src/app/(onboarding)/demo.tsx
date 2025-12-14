import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientBackground, Button } from '@/components/ui';
import { ArrowRight, Sparkles } from 'lucide-react-native';

const MESSAGES = [
  { id: 1, role: 'user', text: 'Chcę pojechać do Rzymu na weekend.' },
  { id: 2, role: 'ai', text: 'Świetny wybór! 🇮🇹 Przygotowuję plan zwiedzania...' },
  { id: 3, role: 'ai', text: 'Znalazłem tanie loty i hotel w centrum. Oto Twój plan:' },
];

export default function DemoScreen() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < MESSAGES.length) {
          return prev + 1;
        }
        clearInterval(interval);
        setTimeout(() => setShowResult(true), 600);
        return prev;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    router.replace('/(onboarding)/welcome');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <Text style={styles.title}>Zobacz jak to działa</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {MESSAGES.map((msg, index) => {
            if (index >= visibleCount) return null;
            const isUser = msg.role === 'user';
            return (
              <Animated.View 
                key={msg.id} 
                entering={FadeInUp.springify()} 
                style={[
                  styles.messageBubble, 
                  isUser ? styles.userBubble : styles.aiBubble
                ]}
              >
                <Text style={isUser ? styles.userText : styles.aiText}>{msg.text}</Text>
              </Animated.View>
            );
          })}

          {showResult && (
            <Animated.View entering={FadeInUp.springify().delay(200)} style={styles.resultCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Weekend w Rzymie</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>GOTOWE</Text>
                </View>
              </View>
              <Text style={styles.cardSubtitle}>2 dni • Lot + Hotel • Zwiedzanie</Text>
              <View style={styles.cardDivider} />
              <View style={styles.aiNote}>
                <Sparkles size={16} color={colors.green.primary} />
                <Text style={styles.aiNoteText}>Plan zoptymalizowany pod kątem pogody.</Text>
              </View>
            </Animated.View>
          )}
        </ScrollView>

        {showResult && (
          <Animated.View entering={FadeIn.duration(500)} style={styles.footer}>
            <Button 
              label="Zacznij planować" 
              onPress={handleStart}
              icon={ArrowRight}
              fullWidth
            />
          </Animated.View>
        )}
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: layout.screenPadding,
    alignItems: 'center',
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 14,
  },
  content: {
    padding: layout.screenPadding,
    gap: spacing[4],
  },
  messageBubble: {
    maxWidth: '85%',
    padding: spacing[4],
    borderRadius: 20,
    marginBottom: spacing[2],
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.green.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.background.secondary,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  userText: {
    ...typography.styles.body,
    color: '#FFFFFF',
  },
  aiText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  resultCard: {
    marginTop: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: 24,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: colors.green.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  cardTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  badge: {
    backgroundColor: colors.green.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    ...typography.styles.caption,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardSubtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginVertical: spacing[4],
  },
  aiNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  aiNoteText: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
  },
  footer: {
    padding: layout.screenPadding,
    paddingBottom: spacing[8],
  },
});

