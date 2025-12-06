import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, typography, layout, shadows, gradients } from '@/theme';
import { Button } from '@/components/ui';

interface PlanCardProps {
  title: string;
  price: string;
  period?: string;
  features: string[];
  isPopular?: boolean;
  buttonLabel: string;
  onPress: () => void;
}

export function PlanCard({
  title,
  price,
  period = '/mies',
  features,
  isPopular = false,
  buttonLabel,
  onPress,
}: PlanCardProps) {
  const Container = isPopular ? LinearGradient : View;
  const containerProps = isPopular ? {
    colors: ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.05)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
    style: [styles.container, styles.popularContainer]
  } : {
    style: styles.container
  };

  return (
    // @ts-ignore - types compatibility for LinearGradient/View switch
    <Container {...containerProps}>
      {isPopular && (
        <View style={styles.badge}>
          <Star size={12} color="#FFFFFF" fill="#FFFFFF" />
          <Text style={styles.badgeText}>Popularny</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{price}</Text>
        {price !== '0 zł' && <Text style={styles.period}>{period}</Text>}
      </View>

      <View style={styles.features}>
        {features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Check size={16} color={colors.green.primary} />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      <Button
        label={buttonLabel}
        onPress={onPress}
        variant={isPopular ? 'primary' : 'outline'}
        style={styles.button}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    padding: spacing[6],
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing[4],
    position: 'relative',
    ...shadows.sm,
  },
  popularContainer: {
    borderColor: colors.green.primary,
    borderWidth: 2,
  },
  badge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.green.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    ...typography.styles.caption,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing[2],
    textAlign: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  price: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  period: {
    ...typography.styles.body,
    color: colors.text.tertiary,
    marginLeft: 4,
  },
  features: {
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  featureText: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
  },
  button: {
    marginTop: 'auto',
  },
});

