import { View, Text, Modal, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { colors } from '@/theme';
import { Check, Square, FileText, Shield } from 'lucide-react-native';

interface ConsentModalProps {
  visible: boolean;
  onAccept: () => void;
}

export function ConsentModal({ visible, onAccept }: ConsentModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const router = useRouter();

  const canContinue = termsAccepted && privacyAccepted;

  const handleAccept = () => {
    if (canContinue) {
      onAccept();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Shield size={48} color={colors.accent.primary} />
          </View>

          <Text style={styles.title}>Witaj w TravelAI Guide!</Text>
          <Text style={styles.subtitle}>
            Zanim zaczniesz planować podróże, zapoznaj się z naszymi dokumentami prawnymi.
          </Text>

          <View style={styles.checkboxContainer}>
            <Pressable
              style={styles.checkboxRow}
              onPress={() => setTermsAccepted(!termsAccepted)}
            >
              <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                {termsAccepted && <Check size={16} color={colors.text.primary} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Akceptuję{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/legal/terms')}
                >
                  Regulamin
                </Text>
              </Text>
            </Pressable>

            <Pressable
              style={styles.checkboxRow}
              onPress={() => setPrivacyAccepted(!privacyAccepted)}
            >
              <View style={[styles.checkbox, privacyAccepted && styles.checkboxChecked]}>
                {privacyAccepted && <Check size={16} color={colors.text.primary} />}
              </View>
              <Text style={styles.checkboxLabel}>
                Zapoznałem się z{' '}
                <Text
                  style={styles.link}
                  onPress={() => router.push('/legal/privacy')}
                >
                  Polityką Prywatności
                </Text>
              </Text>
            </Pressable>
          </View>

          <View style={styles.linksRow}>
            <Pressable
              style={styles.linkButton}
              onPress={() => router.push('/legal/terms')}
            >
              <FileText size={16} color={colors.text.secondary} />
              <Text style={styles.linkButtonText}>Regulamin</Text>
            </Pressable>
            <Pressable
              style={styles.linkButton}
              onPress={() => router.push('/legal/privacy')}
            >
              <Shield size={16} color={colors.text.secondary} />
              <Text style={styles.linkButtonText}>Prywatność</Text>
            </Pressable>
          </View>

          <Pressable
            style={[styles.acceptButton, !canContinue && styles.acceptButtonDisabled]}
            onPress={handleAccept}
            disabled={!canContinue}
          >
            <Text style={[styles.acceptButtonText, !canContinue && styles.acceptButtonTextDisabled]}>
              Kontynuuj
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.accent.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  checkboxContainer: {
    gap: 16,
    marginBottom: 24,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border.default,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.text.primary,
    lineHeight: 22,
  },
  link: {
    color: colors.accent.primary,
    textDecorationLine: 'underline',
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  linkButtonText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  acceptButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonDisabled: {
    backgroundColor: colors.background.tertiary,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  acceptButtonTextDisabled: {
    color: colors.text.muted,
  },
});

