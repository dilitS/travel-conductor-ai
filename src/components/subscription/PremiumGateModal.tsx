import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { colors, typography, spacing, layout } from '@/theme';
import { X, Crown } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface PremiumGateModalProps {
  visible: boolean;
  onClose: () => void;
  featureName: string;
  description?: string;
}

export function PremiumGateModal({ 
  visible, 
  onClose, 
  featureName,
  description 
}: PremiumGateModalProps) {
  const router = useRouter();

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <View style={styles.iconContainer}>
            <Crown size={48} color={colors.accent.primary} />
          </View>

          <Text style={styles.title}>Funkcja Premium</Text>
          <Text style={styles.featureName}>{featureName}</Text>
          
          <Text style={styles.description}>
            {description || `${featureName} jest dostępna tylko w planie Premium. Odblokuj pełny potencjał TravelAI Guide!`}
          </Text>

          <View style={styles.featuresList}>
            <FeatureItem text="Nielimitowane podróże" />
            <FeatureItem text="Przewodnik głosowy AI" />
            <FeatureItem text="Edycja planu z AI" />
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              onClose();
              router.push('/subscription/plans');
            }}
          >
            <Text style={styles.buttonText}>Zobacz Plany</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.bullet} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[4],
  },
  container: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.xl,
    padding: spacing[6],
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  closeButton: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    padding: spacing[2],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // accent color with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  title: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing[1],
  },
  featureName: {
    ...typography.styles.h4,
    color: colors.accent.primary,
    marginBottom: spacing[4],
    textAlign: 'center',
  },
  description: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  featuresList: {
    width: '100%',
    marginBottom: spacing[6],
    gap: spacing[2],
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent.primary,
  },
  featureText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[8],
    borderRadius: layout.radius.full,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...typography.styles.button,
    color: '#FFFFFF',
  },
});

