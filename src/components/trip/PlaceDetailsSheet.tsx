/**
 * PlaceDetailsSheet Component
 * Modal/BottomSheet showing place details, tips, history
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  runOnJS,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  X,
  MapPin,
  Clock,
  Lightbulb,
  History,
  Eye,
  AlertCircle,
} from 'lucide-react-native';
import { colors, spacing, typography, layout, gradients } from '@/theme';
import { Place } from '@/types/place';
import { HeaderIconButton } from '@/components/ui';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type TabType = 'info' | 'tips' | 'history';

interface PlaceDetailsSheetProps {
  place: Place | null;
  isVisible: boolean;
  onClose: () => void;
}

export function PlaceDetailsSheet({
  place,
  isVisible,
  onClose,
}: PlaceDetailsSheetProps) {
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const translateY = useSharedValue(SCREEN_HEIGHT);

  React.useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      translateY.value = withSpring(SCREEN_HEIGHT, { damping: 20, stiffness: 150 });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!place) return null;

  const notes = place.notes_json;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlayWrapper}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
        <Pressable style={styles.backdropPress} onPress={onClose} />
        
        <Animated.View style={[styles.sheet, animatedStyle]}>
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            {place.thumbnail_url ? (
              <Image
                source={{ uri: place.thumbnail_url }}
                style={styles.heroImage}
                contentFit="cover"
                transition={300}
              />
            ) : (
              <View style={styles.heroPlaceholder}>
                <MapPin size={48} color={colors.text.tertiary} />
              </View>
            )}
            <LinearGradient
              colors={['transparent', colors.background.secondary]}
              style={styles.heroGradient}
            />
            
            {/* Close Button */}
            <HeaderIconButton onPress={onClose} accessibilityLabel="Zamknij" style={styles.closeButton}>
              <X size={24} color={colors.text.secondary} />
            </HeaderIconButton>
            
            {/* Title over image */}
            <View style={styles.heroContent}>
              <Text style={styles.title}>{place.name}</Text>
              <View style={styles.locationRow}>
                <MapPin size={14} color={colors.text.secondary} />
                <Text style={styles.location}>{place.city}, {place.country}</Text>
              </View>
              
              {/* Categories */}
              <View style={styles.categories}>
                {place.categories.slice(0, 3).map((cat, i) => (
                  <View key={i} style={styles.categoryChip}>
                    <Text style={styles.categoryText}>{cat}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'info' && styles.activeTab]}
              onPress={() => setActiveTab('info')}
            >
              <Eye size={16} color={activeTab === 'info' ? colors.green.primary : colors.text.secondary} />
              <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
                Opis
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'tips' && styles.activeTab]}
              onPress={() => setActiveTab('tips')}
            >
              <Lightbulb size={16} color={activeTab === 'tips' ? colors.green.primary : colors.text.secondary} />
              <Text style={[styles.tabText, activeTab === 'tips' && styles.activeTabText]}>
                Porady
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'history' && styles.activeTab]}
              onPress={() => setActiveTab('history')}
            >
              <History size={16} color={activeTab === 'history' ? colors.green.primary : colors.text.secondary} />
              <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
                Historia
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'info' && (
              <View style={styles.tabContent}>
                {/* Short Intro */}
                <Text style={styles.introText}>{notes.short_intro}</Text>
                
                {/* Duration */}
                <View style={styles.infoRow}>
                  <Clock size={18} color={colors.green.primary} />
                  <Text style={styles.infoText}>
                    Typowy czas zwiedzania: ~{place.typical_visit_duration_min} min
                  </Text>
                </View>
                
                {/* What to look at */}
                {notes.what_to_look_at && notes.what_to_look_at.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Na co zwrócić uwagę</Text>
                    {notes.what_to_look_at.map((item, i) => (
                      <View key={i} style={styles.listItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.listText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {/* Fun Facts */}
                {notes.fun_facts && notes.fun_facts.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Ciekawostki</Text>
                    {notes.fun_facts.map((fact, i) => (
                      <View key={i} style={styles.factCard}>
                        <AlertCircle size={16} color={colors.semantic.info} />
                        <Text style={styles.factText}>{fact}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {activeTab === 'tips' && (
              <View style={styles.tabContent}>
                {notes.practical_tips && notes.practical_tips.length > 0 ? (
                  notes.practical_tips.map((tip, i) => (
                    <View key={i} style={styles.tipCard}>
                      <Lightbulb size={20} color={colors.semantic.warning} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>Brak porad dla tego miejsca.</Text>
                )}
              </View>
            )}

            {activeTab === 'history' && (
              <View style={styles.tabContent}>
                {notes.history ? (
                  <Text style={styles.historyText}>{notes.history}</Text>
                ) : (
                  <Text style={styles.emptyText}>Historia tego miejsca pojawi się wkrótce.</Text>
                )}
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    // backgroundColor removed to let BlurView handle it
    justifyContent: 'flex-start',
  },
  backdropPress: {
    flex: 1,
  },
  sheet: {
    position: 'absolute',
    top: spacing[6],
    left: spacing[4],
    right: spacing[4],
    backgroundColor: colors.background.secondary,
    borderTopLeftRadius: layout.radius.xl,
    borderTopRightRadius: layout.radius.xl,
    overflow: 'hidden',
    borderRadius: layout.radius.xl,
    maxHeight: SCREEN_HEIGHT * 0.92,
  },
  heroContainer: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background.tertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing[4],
  },
  title: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  location: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  categoryChip: {
    backgroundColor: colors.green.soft,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: layout.radius.sm,
  },
  categoryText: {
    ...typography.styles.caption,
    color: colors.green.primary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.green.primary,
  },
  tabText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  activeTabText: {
    color: colors.green.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: spacing[4],
  },
  introText: {
    ...typography.styles.body,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.background.tertiary,
    padding: spacing[3],
    borderRadius: layout.radius.md,
    marginBottom: spacing[4],
  },
  infoText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
    marginBottom: spacing[3],
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.green.primary,
    marginTop: 7,
  },
  listText: {
    ...typography.styles.body,
    color: colors.text.secondary,
    flex: 1,
  },
  factCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    backgroundColor: colors.blue.soft,
    padding: spacing[3],
    borderRadius: layout.radius.md,
    marginBottom: spacing[2],
  },
  factText: {
    ...typography.styles.bodySmall,
    color: colors.text.primary,
    flex: 1,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: spacing[3],
    borderRadius: layout.radius.md,
    marginBottom: spacing[2],
  },
  tipText: {
    ...typography.styles.body,
    color: colors.text.primary,
    flex: 1,
  },
  historyText: {
    ...typography.styles.body,
    color: colors.text.primary,
    lineHeight: 26,
  },
  emptyText: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    textAlign: 'center',
    paddingVertical: spacing[8],
  },
});

