/**
 * ActivityStackCard Component
 * Card with stacking effect and color coding by activity type
 * Wallet-style UI Design - Redesigned
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Utensils,
  Bed,
  Coffee,
  Train,
  ChevronDown,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { Step, StepType, isTransferStep } from '@/types/step';
import { Place } from '@/types/place';
import { hapticImpactMedium, hapticSelection } from '@/utils/haptics';

const OVERLAP_AMOUNT = 50; // Reduced overlap so headers are always visible
const STACK_SPRING = { damping: 15, stiffness: 150, mass: 0.8 };
const PRESS_SPRING = { damping: 14, stiffness: 200, mass: 0.7 };

interface CardStyleConfig {
  gradient: readonly [string, string];
  textColor: string;
  subTextColor: string;
  iconColor: string;
  accentColor: string;
  glassColor: string;
}

interface ActivityStackCardProps {
  step: Step;
  place?: Place;
  fromPlace?: Place;
  toPlace?: Place;
  index: number;
  isFirst: boolean;
  isExpanded: boolean;
  isPreviousExpanded: boolean;
  onPress: () => void;
  onExpand: () => void;
}

/**
 * Get icon for step type
 */
function getStepIcon(type: StepType) {
  switch (type) {
    case 'visit':
      return MapPin;
    case 'meal':
      return Utensils;
    case 'accommodation':
      return Bed;
    case 'relax':
      return Coffee;
    case 'transfer':
      return Train;
    default:
      return MapPin;
  }
}

/**
 * Get label for step type
 */
function getStepLabel(type: StepType): string {
  switch (type) {
    case 'visit':
      return 'Zwiedzanie';
    case 'meal':
      return 'Posiłek';
    case 'accommodation':
      return 'Nocleg';
    case 'relax':
      return 'Odpoczynek';
    case 'transfer':
      return 'Transport';
    default:
      return type;
  }
}

/**
 * Get card style configuration based on type
 * Updated for Elegant Gradients System
 */
function getCardStyleConfig(type: StepType): CardStyleConfig {
  switch (type) {
    case 'transfer':
      return {
        // Deep Charcoal/Gray (transport now uses former visit palette)
        gradient: ['#27272A', '#09090B'],
        textColor: '#FAFAFA',
        subTextColor: 'rgba(250,250,250,0.7)',
        iconColor: '#E4E4E7',
        accentColor: '#52525B', // Neutral accent
        glassColor: 'rgba(255,255,255,0.1)',
      };
    case 'meal':
      return {
        // Deep Bronze/Espresso
        gradient: ['#451A03', '#291002'], // from amber/orange palette
        textColor: '#FFF7ED',
        subTextColor: 'rgba(255,247,237,0.7)',
        iconColor: '#FDBA74',
        accentColor: '#F97316',
        glassColor: 'rgba(255,255,255,0.1)',
      };
    case 'accommodation':
      return {
        // Deep Midnight/Indigo
        gradient: ['#1E1B4B', '#0F0725'],
        textColor: '#EEF2FF',
        subTextColor: 'rgba(238,242,255,0.7)',
        iconColor: '#A5B4FC',
        accentColor: '#6366F1',
        glassColor: 'rgba(255,255,255,0.1)',
      };
    case 'relax':
      return {
        // Deep Slate/Blue
        gradient: ['#0F172A', '#020617'],
        textColor: '#F8FAFC',
        subTextColor: 'rgba(248,250,252,0.7)',
        iconColor: '#38BDF8',
        accentColor: '#0EA5E9',
        glassColor: 'rgba(255,255,255,0.1)',
      };
    case 'visit':
    default:
      return {
        // Deep Emerald/Forest (visit now uses former transport palette)
        gradient: ['#064E3B', '#022C22'],
        textColor: '#ECFDF5',
        subTextColor: 'rgba(236,253,245,0.7)',
        iconColor: '#34D399',
        accentColor: '#10B981',
        glassColor: 'rgba(255,255,255,0.1)',
      };
  }
}

export function ActivityStackCard({
  step,
  place,
  fromPlace,
  toPlace,
  index,
  isFirst,
  isExpanded,
  isPreviousExpanded,
  onPress,
  onExpand,
}: ActivityStackCardProps) {
  const Icon = getStepIcon(step.type);
  const styleConfig = getCardStyleConfig(step.type);
  
  // Rotation value for chevron
  const rotation = useSharedValue(isExpanded ? 180 : 0);
  const scale = useSharedValue(1);
  const offsetY = useSharedValue(0);
  const shadowStrength = useSharedValue(0.25);
  const pressTranslate = useSharedValue(0);
  const pressTilt = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isExpanded ? 180 : 0, { duration: 300 });
  }, [isExpanded]);

  React.useEffect(() => {
    if (isExpanded) {
      scale.value = withSpring(1.03, STACK_SPRING);
      offsetY.value = withSpring(-8, STACK_SPRING);
      shadowStrength.value = withSpring(0.5, STACK_SPRING);
    } else {
      scale.value = withSpring(1, STACK_SPRING);
      offsetY.value = withSpring(0, STACK_SPRING);
      shadowStrength.value = withSpring(0.15, STACK_SPRING);
    }
  }, [isExpanded]);

  const chevronStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: offsetY.value + pressTranslate.value },
        { scale: scale.value },
        { rotateX: `${pressTilt.value}deg` },
      ],
    };
  });

  const shadowAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowOpacity: shadowStrength.value,
      shadowRadius: 12 + shadowStrength.value * 8,
      elevation: 6 + shadowStrength.value * 8,
    };
  });

  const handlePressIn = () => {
    hapticSelection();
    pressTranslate.value = withSpring(-6, PRESS_SPRING);
    pressTilt.value = withSpring(2, PRESS_SPRING);
    scale.value = withSpring(isExpanded ? 1.05 : 1.02, PRESS_SPRING);
  };

  const handlePressOut = () => {
    pressTranslate.value = withSpring(0, PRESS_SPRING);
    pressTilt.value = withSpring(0, PRESS_SPRING);
    scale.value = withSpring(isExpanded ? 1.03 : 1, PRESS_SPRING);
  };

  // Get title based on step type
  const getTitle = () => {
    if (isTransferStep(step)) {
      const from = fromPlace?.name || step.from_place_id;
      const to = toPlace?.name || step.to_place_id;
      return `${from} → ${to}`;
    }
    return place?.name || (step as { place_id?: string }).place_id || getStepLabel(step.type);
  };

  // Get time display
  const timeDisplay = step.planned_start
    ? `${step.planned_start}${step.planned_end ? ` - ${step.planned_end}` : ''}`
    : null;

  // Margin top logic
  const marginTop = isFirst ? 0 : (isPreviousExpanded ? 16 : -OVERLAP_AMOUNT);

  // Z-Index logic
  const zIndex = isExpanded ? 999 : index;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          marginTop,
          zIndex,
          borderColor: isExpanded ? styleConfig.accentColor : 'transparent', // Highlight border when expanded
          borderWidth: isExpanded ? 1 : 0,
        },
        shadowAnimatedStyle,
        cardAnimatedStyle,
      ]}
    >
      <Pressable 
        style={styles.pressable} 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onExpand}
      >
        <LinearGradient
          colors={styleConfig.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={[styles.innerCard, isExpanded && { borderColor: 'rgba(255,255,255,0.15)' }]}>
            {/* TOP ROW: Icon | Label | Time */}
            <View style={styles.topRow}>
              <View style={styles.topLeft}>
                <View style={[styles.iconContainer, { backgroundColor: styleConfig.glassColor }]}>
                  <Icon size={16} color={styleConfig.iconColor} />
                </View>
                <Text style={[styles.typeLabel, { color: styleConfig.subTextColor }]}>
                  {getStepLabel(step.type)}
                </Text>
              </View>
              
              <Text style={[styles.timeText, { color: styleConfig.subTextColor }]}>
                {timeDisplay}
              </Text>
            </View>

            {/* TITLE */}
            <Text 
              style={[styles.title, { color: styleConfig.textColor }]} 
              numberOfLines={isExpanded ? 3 : 2}
            >
              {getTitle()}
            </Text>

            {/* DETAILS ROW (Collapsed) */}
            {!isExpanded && (
              <View style={styles.detailsRow}>
                {step.cost && (
                  <View style={[styles.pill, { backgroundColor: styleConfig.glassColor }]}>
                    <Text style={[styles.pillText, { color: styleConfig.textColor }]}>{step.cost}</Text>
                  </View>
                )}
                {isTransferStep(step) && (
                  <Text style={[styles.metaText, { color: styleConfig.subTextColor }]}>
                    {step.est_duration_min} min • {step.move_mode}
                  </Text>
                )}
                <View style={{ flex: 1 }} />
                <Animated.View style={chevronStyle}>
                  <ChevronDown size={20} color={styleConfig.iconColor} />
                </Animated.View>
              </View>
            )}

            {/* EXPANDED CONTENT */}
            {isExpanded && (
              <View style={styles.expandedContent}>
                {/* Image */}
                {place?.thumbnail_url && (
                  <Image
                    source={{ uri: place.thumbnail_url }}
                    style={styles.thumbnail}
                    contentFit="cover"
                    transition={300}
                  />
                )}

                {/* Expanded Details */}
                <View style={styles.expandedDetails}>
                  {step.cost && (
                    <View style={styles.row}>
                      <DollarSign size={18} color={styleConfig.subTextColor} />
                      <Text style={[styles.detailText, { color: styleConfig.subTextColor }]}>{step.cost}</Text>
                    </View>
                  )}
                  
                  {isTransferStep(step) && (
                     <View style={styles.row}>
                       <Clock size={18} color={styleConfig.subTextColor} />
                       <Text style={[styles.detailText, { color: styleConfig.subTextColor }]}>{step.est_duration_min} min</Text>
                     </View>
                  )}

                  {step.notes && (
                    <Text style={[styles.notes, { color: styleConfig.subTextColor }]}>{step.notes}</Text>
                  )}
                </View>

                {/* Action Button */}
                {(step.type === 'visit' || step.type === 'meal' || step.type === 'accommodation') && place && (
                  <Pressable 
                    style={[styles.detailsButton, { backgroundColor: styleConfig.accentColor }]} 
                    onPress={() => {
                      hapticImpactMedium();
                      onPress();
                    }}
                  >
                    <Text style={[styles.detailsButtonText, { color: '#FFFFFF' }]}>Zobacz szczegóły</Text>
                    <ArrowRight size={18} color="#FFFFFF" />
                  </Pressable>
                )}
                
                {/* Collapse chevron */}
                <View style={styles.collapseContainer}>
                  <Animated.View style={chevronStyle}>
                     <ChevronDown size={24} color={styleConfig.subTextColor} />
                  </Animated.View>
                </View>
              </View>
            )}
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: layout.screenPadding,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
    overflow: 'visible',
  },
  pressable: {
    padding: 0,
    minHeight: 120,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: 20,
    flex: 1,
  },
  innerCard: {
    borderRadius: 20,
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
    paddingHorizontal: spacing[4],
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  topLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeLabel: {
    ...typography.styles.caption,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  timeText: {
    ...typography.styles.bodySmall,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  title: {
    ...typography.styles.h2,
    fontSize: 22,
    lineHeight: 28,
    marginBottom: spacing[3],
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: 'auto', // Push to bottom
  },
  pill: {
    paddingHorizontal: spacing[3],
    paddingVertical: 6,
    borderRadius: 12,
  },
  pillText: {
    ...typography.styles.caption,
    fontWeight: '700',
  },
  metaText: {
    ...typography.styles.bodySmall,
  },
  expandedContent: {
    marginTop: spacing[2],
    gap: spacing[4],
  },
  thumbnail: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  expandedDetails: {
    gap: spacing[2],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  detailText: {
    ...typography.styles.body,
  },
  notes: {
    ...typography.styles.body,
    lineHeight: 24,
    marginTop: spacing[2],
  },
  detailsButton: {
    paddingVertical: 16,
    paddingHorizontal: spacing[4],
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  detailsButtonText: {
    ...typography.styles.body,
    fontWeight: '700',
  },
  collapseContainer: {
    alignItems: 'center',
    paddingTop: spacing[2],
  },
});

