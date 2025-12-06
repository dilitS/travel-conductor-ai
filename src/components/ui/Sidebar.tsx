/**
 * Sidebar - Drawer navigation content
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Map, 
  PlusSquare, 
  Globe, 
  Settings, 
  LogOut,
  LucideIcon,
} from 'lucide-react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { colors, spacing, typography, layout } from '@/theme';
import { Avatar } from './Avatar';
import { useAuth } from '@/hooks';

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  isActive?: boolean;
}

function MenuItem({ icon: Icon, label, onPress, isActive = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isActive && styles.menuItemActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Icon 
        size={22} 
        color={isActive ? colors.green.primary : colors.text.secondary} 
      />
      <Text style={[styles.menuItemLabel, isActive && styles.menuItemLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface SidebarProps extends DrawerContentComponentProps {}

export function Sidebar({ navigation }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: Map, label: 'Moje Podróże', route: '/' },
    { icon: PlusSquare, label: 'Nowa Podróż', route: '/creator' },
    { icon: Globe, label: 'Społeczność', route: '/community' },
    { icon: Settings, label: 'Ustawienia', route: '/account' },
  ];

  function handleNavigate(route: string) {
    navigation.closeDrawer();
    if (route === '/creator') {
      router.push('/creator');
    } else {
      router.replace(route as '/' | '/community' | '/account');
    }
  }

  async function handleLogout() {
    navigation.closeDrawer();
    await signOut();
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <Avatar 
          url={user?.photo_url || undefined} 
          name={user?.display_name || 'User'} 
          size={64} 
        />
        <Text style={styles.userName}>{user?.display_name || 'Użytkownik'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        {menuItems.map((item) => (
          <MenuItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            onPress={() => handleNavigate(item.route)}
            isActive={pathname === item.route || (item.route === '/' && pathname === '/(drawer)')}
          />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color={colors.semantic.error} />
          <Text style={styles.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>Travel Conductor AI v1.0.0</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  profileSection: {
    padding: spacing[6],
    paddingTop: spacing[8],
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
    alignItems: 'center',
  },
  userName: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing[3],
  },
  userEmail: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginTop: spacing[1],
  },
  menuSection: {
    flex: 1,
    paddingTop: spacing[4],
    paddingHorizontal: spacing[3],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderRadius: layout.radius.md,
    marginBottom: spacing[1],
    gap: spacing[3],
  },
  menuItemActive: {
    backgroundColor: colors.green.soft,
  },
  menuItemLabel: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  menuItemLabelActive: {
    color: colors.green.primary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  logoutText: {
    ...typography.styles.body,
    color: colors.semantic.error,
  },
  version: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginTop: spacing[2],
  },
});

