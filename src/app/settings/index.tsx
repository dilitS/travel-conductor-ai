/**
 * Settings Screen
 * Account management, preferences, subscription
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography, layout } from '@/theme';
import { GradientBackground, HeaderIconButton } from '@/components/ui';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Bell, 
  Palette, 
  Crown, 
  Shield, 
  HelpCircle, 
  LogOut,
  Globe,
  Moon,
} from 'lucide-react-native';
import { useAuth } from '@/hooks';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  showChevron?: boolean;
  destructive?: boolean;
  subtitle?: string;
}

function SettingsItem({ icon, label, onPress, showChevron = true, destructive = false, subtitle }: SettingsItemProps) {
  return (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingsItemLeft}>
        {icon}
        <View>
          <Text style={[styles.settingsItemLabel, destructive && styles.destructiveText]}>{label}</Text>
          {subtitle && <Text style={styles.settingsItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showChevron && <ChevronRight size={20} color={colors.text.tertiary} />}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
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
          <Text style={styles.title}>Ustawienia</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Account Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Konto</Text>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon={<User size={20} color={colors.green.primary} />}
                label="Profil"
                subtitle={user?.email}
                onPress={() => router.push('/(main)/profile')}
              />
              <View style={styles.divider} />
              <SettingsItem
                icon={<Crown size={20} color={colors.gold} />}
                label="Subskrypcja"
                subtitle="Free"
                onPress={() => router.push('/subscription/plans')}
              />
            </View>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferencje</Text>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon={<Bell size={20} color={colors.text.secondary} />}
                label="Powiadomienia"
                onPress={() => console.log('Notifications')}
              />
              <View style={styles.divider} />
              <SettingsItem
                icon={<Globe size={20} color={colors.text.secondary} />}
                label="Język"
                subtitle="Polski"
                onPress={() => console.log('Language')}
              />
              <View style={styles.divider} />
              <SettingsItem
                icon={<Moon size={20} color={colors.text.secondary} />}
                label="Motyw"
                subtitle="Ciemny"
                onPress={() => console.log('Theme')}
              />
            </View>
          </View>

          {/* Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wsparcie</Text>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon={<HelpCircle size={20} color={colors.text.secondary} />}
                label="Pomoc i FAQ"
                onPress={() => console.log('Help')}
              />
              <View style={styles.divider} />
              <SettingsItem
                icon={<Shield size={20} color={colors.text.secondary} />}
                label="Polityka prywatności"
                onPress={() => router.push('/legal/privacy')}
              />
            </View>
          </View>

          {/* Logout */}
          <View style={styles.section}>
            <View style={styles.sectionCard}>
              <SettingsItem
                icon={<LogOut size={20} color={colors.semantic.error} />}
                label="Wyloguj się"
                onPress={handleSignOut}
                showChevron={false}
                destructive
              />
            </View>
          </View>

          {/* App Version */}
          <Text style={styles.version}>Travel Conductor AI v1.0.0</Text>
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
  section: {
    gap: spacing[3],
  },
  sectionTitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: spacing[2],
  },
  sectionCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.xl,
    borderWidth: 1,
    borderColor: colors.border.default,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    gap: spacing[3],
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  settingsItemLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  settingsItemSubtitle: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: 2,
  },
  destructiveText: {
    color: colors.semantic.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.default,
    marginLeft: spacing[4] + 20 + spacing[3], // icon width + gap
  },
  version: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
    marginTop: spacing[4],
  },
});

