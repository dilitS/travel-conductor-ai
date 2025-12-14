import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientBackground, HeaderIconButton } from '@/components/ui';
import { ChevronLeft, MapPin, Globe, Award, LogOut, Settings } from 'lucide-react-native';
import { useAuth } from '@/hooks';

// Dummy stamps
const STAMPS = [
  { id: 1, city: 'Paryż', country: 'FR', date: '2023', color: '#EF4444' },
  { id: 2, city: 'Tokio', country: 'JP', date: '2023', color: '#F59E0B' },
  { id: 3, city: 'Rzym', country: 'IT', date: '2022', color: '#10B981' },
  { id: 4, city: 'Nowy Jork', country: 'US', date: '2022', color: '#3B82F6' },
  { id: 5, city: 'Londyn', country: 'UK', date: '2021', color: '#6366F1' },
  { id: 6, city: 'Berlin', country: 'DE', date: '2021', color: '#8B5CF6' },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <View style={styles.header}>
          <HeaderIconButton onPress={() => router.back()}>
            <ChevronLeft size={24} color={colors.text.primary} />
          </HeaderIconButton>
          <Text style={styles.title}>Mój Paszport</Text>
          <HeaderIconButton onPress={() => router.push('/settings')}>
            <Settings size={20} color={colors.text.secondary} />
          </HeaderIconButton>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Image
                source={user?.photo_url ? { uri: user.photo_url } : { uri: 'https://ui-avatars.com/api/?name=User&background=10B981&color=fff' }}
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.levelBadge}>
                <Award size={12} color="#FFF" />
                <Text style={styles.levelText}>Odkrywca</Text>
              </View>
            </View>
            
            <Text style={styles.name}>{user?.display_name || 'Podróżnik'}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>PODRÓŻY</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>KRAJÓW</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>14k</Text>
                <Text style={styles.statLabel}>KM</Text>
              </View>
            </View>
          </View>

          {/* Stamps Grid */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Globe size={20} color={colors.green.primary} />
              <Text style={styles.sectionTitle}>Moje Pieczątki</Text>
            </View>
            
            <View style={styles.stampsGrid}>
              {STAMPS.map((stamp) => (
                <View key={stamp.id} style={styles.stampItem}>
                  <View style={[styles.stampCircle, { borderColor: stamp.color }]}>
                    <Text style={[styles.stampCode, { color: stamp.color }]}>{stamp.country}</Text>
                    <Text style={[styles.stampDate, { color: stamp.color }]}>{stamp.date}</Text>
                  </View>
                  <Text style={styles.stampCity}>{stamp.city}</Text>
                </View>
              ))}
              {/* Empty slot */}
              <View style={styles.stampItem}>
                <View style={[styles.stampCircle, styles.stampEmpty]}>
                  <View style={styles.stampPlus} />
                </View>
                <Text style={styles.stampCity}>Następna</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingVertical: spacing[4],
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  content: {
    padding: layout.screenPadding,
    gap: spacing[6],
    paddingBottom: 40,
  },
  profileCard: {
    alignItems: 'center',
    padding: spacing[6],
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[3],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.tertiary,
    borderWidth: 3,
    borderColor: colors.background.primary,
  },
  levelBadge: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.green.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    ...typography.styles.caption,
    color: '#FFF',
    fontWeight: '700',
    fontSize: 10,
  },
  name: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  email: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing[6],
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: spacing[4],
  },
  statItem: {
    alignItems: 'center',
    minWidth: 60,
  },
  statValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border.default,
  },
  section: {
    gap: spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  sectionTitle: {
    ...typography.styles.h3,
    color: colors.text.primary,
  },
  stampsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
    justifyContent: 'space-between',
  },
  stampItem: {
    alignItems: 'center',
    width: '30%',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  stampCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    transform: [{ rotate: '-15deg' }],
  },
  stampCode: {
    ...typography.styles.h2,
    fontSize: 24,
    opacity: 0.8,
  },
  stampDate: {
    ...typography.styles.caption,
    fontSize: 10,
    fontWeight: '700',
    opacity: 0.8,
  },
  stampCity: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  stampEmpty: {
    borderColor: colors.border.default,
    borderStyle: 'dashed',
    transform: [{ rotate: '0deg' }],
  },
  stampPlus: {
    width: 20,
    height: 2,
    backgroundColor: colors.border.default,
  },
});

