import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  Bell, Globe, HelpCircle, FileText, LogOut, ChevronRight, 
  Settings, Database, MapPin
} from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Avatar, Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { callFunction, FUNCTION_NAMES } from '@/services/firebase/functions';

interface SettingsItemProps {
  icon: React.ComponentType<{ size: number; color: string }>;
  label: string;
  onPress?: () => void;
  value?: string;
}

function SettingsItem({ icon: Icon, label, onPress, value }: SettingsItemProps) {
  return (
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
}

export default function AccountScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isSeedingKrakow, setIsSeedingKrakow] = useState(false);

  const isPremium = false; // Mock

  const handleSeedKrakow = async () => {
    setIsSeedingKrakow(true);
    try {
      const result = await callFunction<{ success: boolean; tripId: string }>(
        FUNCTION_NAMES.SEED_KRAKOW_TRIP,
        {}
      );
      if (result.success) {
        Alert.alert(
          'Sukces!',
          'Wycieczka do Krakowa została dodana. Sprawdź "Moje Podróże".',
          [{ text: 'OK', onPress: () => router.push('/(drawer)') }]
        );
      }
    } catch (error) {
      console.error('Failed to seed Krakow trip:', error);
      Alert.alert('Błąd', 'Nie udało się dodać wycieczki do Krakowa.');
    } finally {
      setIsSeedingKrakow(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

      {/* Developer Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deweloper</Text>
        <TouchableOpacity 
          style={styles.item} 
          onPress={handleSeedKrakow}
          disabled={isSeedingKrakow}
        >
          <View style={styles.itemLeft}>
            <MapPin size={20} color={colors.green.primary} />
            <Text style={styles.itemLabel}>
              {isSeedingKrakow ? 'Dodawanie...' : 'Dodaj wycieczkę do Krakowa'}
            </Text>
          </View>
          <View style={styles.itemRight}>
            <Database size={20} color={colors.text.tertiary} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
          <LogOut size={20} color={colors.semantic.error} />
          <Text style={styles.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>Wersja 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  content: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: spacing[6],
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
    backgroundColor: colors.background.secondary,
    padding: spacing[4],
    borderRadius: layout.radius.md,
    marginBottom: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.default,
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
    backgroundColor: colors.background.primary,
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

