import { Tabs, useRouter } from 'expo-router';
import { colors } from '@/theme';
import { Map, PlusSquare, Globe, User } from 'lucide-react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border.default,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: colors.green.primary,
        tabBarInactiveTintColor: colors.text.tertiary,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Moje Podróże',
          tabBarIcon: ({ color, size }) => <Map size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="creator"
        options={{
          title: 'Kreator',
          tabBarIcon: ({ color, size }) => <PlusSquare size={size} color={color} />,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push('/creator');
          },
        })}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Społeczność',
          tabBarIcon: ({ color, size }) => <Globe size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Konto',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
