import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, Globe, HelpCircle, FileText, LogOut, ChevronRight, 
  CreditCard, Settings 
} from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Avatar, Button } from '@/components/ui';
import { useAuth } from '@/hooks';

const SettingsItem = ({ icon: Icon, label, onPress, value }: any) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    <View style={styles.itemLeft}>
      <Icon size={20} color={colors.text.secondary} />
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <View style={styles.itemRight}>
      {value && <Text style={styles.itemValue}>{value}</Text>}
      <ChevronRight size={20} color={colors.text.tertiary} />
    </View>
  </TouchableOpacity>
);

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const isPremium = false; // Mock

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Konto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Avatar 
            url={user?.photo_url || undefined} 
            name={user?.display_name || 'User'} 
            size={80} 
          />
          <Text style={styles.name}>{user?.display_name || 'Użytkownik'}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{isPremium ? 'PREMIUM' : 'FREE'}</Text>
          </View>
        </View>

        {/* Upsell Card */}
        {!isPremium && (
          <View style={styles.upsellCard}>
            <Text style={styles.upsellTitle}>Przejdź na Premium</Text>
            <Text style={styles.upsellText}>
              Nielimitowane plany i zaawansowane AI.
            </Text>
            <Button
              label="Zobacz plany"
              size="sm"
              onPress={() => router.push('/subscription/plans')}
              style={styles.upsellButton}
            />
          </View>
        )}

        {/* Settings List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ustawienia</Text>
          <SettingsItem icon={Bell} label="Powiadomienia" value="Wł." />
          <SettingsItem icon={Globe} label="Język" value="Polski" />
          <SettingsItem icon={Settings} label="Jednostki" value="Metryczne" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Wsparcie</Text>
          <SettingsItem icon={HelpCircle} label="Centrum pomocy" />
          <SettingsItem icon={FileText} label="Regulamin i prywatność" />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <LogOut size={20} color={colors.semantic.error} />
            <Text style={styles.logoutText}>Wyloguj się</Text>
          </TouchableOpacity>
          
          <Text style={styles.version}>Wersja 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: spacing[4],
    marginBottom: spacing[4],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
  },
  content: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  name: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginTop: spacing[3],
    marginBottom: spacing[1],
  },
  email: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[3],
  },
  badge: {
    borderWidth: 1,
    borderColor: colors.green.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: 'bold',
  },
  upsellCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.background.secondary, // Or gradient
    padding: spacing[4],
    borderRadius: layout.radius.md,
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.default,
    // Optional: make it stand out more
    alignItems: 'center',
  },
  upsellTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  upsellText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  upsellButton: {
    width: '100%',
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    ...typography.styles.label,
    color: colors.text.tertiary,
    marginLeft: layout.screenPadding,
    marginBottom: spacing[2],
    textTransform: 'uppercase',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: layout.screenPadding,
    backgroundColor: colors.background.primary, // or transparent
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  itemLabel: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  itemValue: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
  footer: {
    paddingHorizontal: layout.screenPadding,
    gap: spacing[4],
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    padding: spacing[3],
  },
  logoutText: {
    ...typography.styles.body,
    color: colors.semantic.error,
    fontWeight: '500',
  },
  version: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },
});
