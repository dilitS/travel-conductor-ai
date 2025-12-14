import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MapPin } from 'lucide-react-native';
import { CreatorLayout } from '@/components/creator';
import { Input, GradientButton } from '@/components/ui';
import { colors, spacing, typography, layout } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';
import { Image } from 'expo-image';

const POPULAR_VISUALS = [
  { city: 'Paryż', country: 'Francja', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=500' },
  { city: 'Rzym', country: 'Włochy', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=500' },
  { city: 'Tokio', country: 'Japonia', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=500' },
  { city: 'Nowy Jork', country: 'USA', image: 'https://images.unsplash.com/photo-1496442226666-8d4a0e62e6e9?q=80&w=500' },
  { city: 'Londyn', country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=500' },
  { city: 'Barcelona', country: 'Hiszpania', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?q=80&w=500' },
];

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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.heading}>Gdzie chcesz pojechać?</Text>
          
          <Input
            placeholder="Szukaj miasta, kraju..."
            leftIcon={Search}
            value={searchValue}
            onChangeText={setSearchValue}
            autoFocus={false}
          />

          <Text style={styles.subheading}>Inspiracje</Text>
          <View style={styles.grid}>
            {POPULAR_VISUALS.map((item) => {
              const isSelected = searchValue === item.city;
              return (
                <TouchableOpacity
                  key={item.city}
                  style={[styles.card, isSelected && styles.selectedCard]}
                  onPress={() => handleSelect(item.city)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: item.image }} style={styles.cardImage} contentFit="cover" />
                  <View style={styles.cardOverlay} />
                  {isSelected && <View style={styles.selectedOverlay} />}
                  
                  <View style={styles.cardContent}>
                    <Text style={styles.cardCity}>{item.city}</Text>
                    <Text style={styles.cardCountry}>{item.country}</Text>
                  </View>
                  
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <MapPin size={16} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

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
  scrollContent: {
    paddingTop: spacing[4],
    paddingBottom: 120, // Space for fixed footer
  },
  heading: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[6],
  },
  subheading: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[4],
  },
  card: {
    width: '47%', // slightly less than 50% to account for gap
    aspectRatio: 0.8,
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.background.secondary,
  },
  selectedCard: {
    borderColor: colors.green.primary,
    borderWidth: 2,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(34,197,94,0.3)',
  },
  cardContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[3],
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  cardCity: {
    ...typography.styles.h4,
    color: '#FFFFFF',
    fontSize: 16,
  },
  cardCountry: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.8)',
  },
  checkIcon: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
  },
});
