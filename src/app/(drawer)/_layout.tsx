/**
 * Drawer Layout - Main navigation with sidebar
 */

import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Menu } from 'lucide-react-native';
import { colors, spacing, layout } from '@/theme';
import { Sidebar } from '@/components/ui';

function HamburgerButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={styles.hamburgerButton}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      activeOpacity={0.7}
    >
      <Menu size={24} color={colors.text.primary} />
    </TouchableOpacity>
  );
}

function EmptyHeaderLeft() {
  return <View style={styles.emptyHeader} />;
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.5)',
        swipeEnabled: true,
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background.primary,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.default,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerLeft: () => <EmptyHeaderLeft />,
        headerRight: () => <HamburgerButton />,
        drawerPosition: 'right',
        drawerStyle: {
          backgroundColor: colors.background.secondary,
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Moje Podróże',
        }}
      />
      <Drawer.Screen
        name="community"
        options={{
          title: 'Społeczność',
        }}
      />
      <Drawer.Screen
        name="account"
        options={{
          title: 'Konto',
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  hamburgerButton: {
    marginRight: spacing[4],
    padding: spacing[2],
  },
  emptyHeader: {
    width: 40,
  },
});

