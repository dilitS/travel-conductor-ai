import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import { CreatorLayout } from '@/components/creator';
import { Input, Chip, GradientButton } from '@/components/ui';
import { colors, spacing, typography } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';

const POPULAR_DESTINATIONS = ['Paryż', 'Rzym', 'Tokio', 'Nowy Jork', 'Londyn', 'Barcelona', 'Dubaj', 'Lizbona'];

export default function CreatorStep1() {
  const router = useRouter();
  const { setDestination, draft, nextStep, setStep } = useCreatorStore();
  const [searchValue, setSearchValue] = useState(draft.destination);

  React.useEffect(() => {
    setStep(1);
  }, []);

  const handleSelect = (city: string) => {
    setSearchValue(city);
    setDestination(city);
  };

  const handleNext = () => {
    if (searchValue.trim()) {
      setDestination(searchValue.trim());
      nextStep();
      router.push('/creator/dates');
    }
  };

  return (
    <CreatorLayout title="Nowa podróż" showBack={false}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Gdzie chcesz pojechać?</Text>
          
          <Input
            placeholder="Szukaj miasta, kraju..."
            leftIcon={Search}
            value={searchValue}
            onChangeText={setSearchValue}
            autoFocus
          />

          <Text style={styles.subheading}>Popularne kierunki</Text>
          <View style={styles.chipsContainer}>
            {POPULAR_DESTINATIONS.map((city) => (
              <Chip
                key={city}
                label={city}
                selected={searchValue === city}
                onPress={() => handleSelect(city)}
              />
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Dalej"
            onPress={handleNext}
            disabled={!searchValue.trim()}
            fullWidth
          />
        </View>
      </View>
    </CreatorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: spacing[4],
    paddingBottom: 100, // Space for fixed footer
  },
  heading: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[6],
  },
  subheading: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginTop: spacing[4],
    marginBottom: spacing[3],
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
  },
});
