import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { MapPin, Mail, Lock, User, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { GradientButton } from '@/components/ui';
import { colors, gradients, spacing, typography, layout } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const { signUpWithEmail, isLoading, error, clearError } = useAuthStore();

  const validateForm = (): boolean => {
    setLocalError(null);
    clearError();

    if (!displayName.trim()) {
      setLocalError('Podaj swoje imię');
      return false;
    }
    if (!email.trim()) {
      setLocalError('Podaj adres email');
      return false;
    }
    if (!password) {
      setLocalError('Podaj hasło');
      return false;
    }
    if (password.length < 6) {
      setLocalError('Hasło musi mieć min. 6 znaków');
      return false;
    }
    if (password !== confirmPassword) {
      setLocalError('Hasła nie są identyczne');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    await signUpWithEmail(email.trim(), password, displayName.trim());
  };

  const displayError = localError || error;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background.colors}
        start={gradients.background.start}
        end={gradients.background.end}
        style={styles.background}
      />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
            
            <View style={styles.logoSmall}>
              <LinearGradient
                colors={gradients.primary.colors}
                start={gradients.primary.start}
                end={gradients.primary.end}
                style={styles.logoGradientSmall}
              >
                <MapPin size={24} color="#FFFFFF" />
              </LinearGradient>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Utwórz konto</Text>
          <Text style={styles.subtitle}>Dołącz do TravelAI Guide</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Display Name */}
            <View style={styles.inputContainer}>
              <User size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Twoje imię"
                placeholderTextColor={colors.text.tertiary}
                value={displayName}
                onChangeText={setDisplayName}
                autoCapitalize="words"
                autoComplete="name"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Mail size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Adres email"
                placeholderTextColor={colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Hasło (min. 6 znaków)"
                placeholderTextColor={colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color={colors.text.tertiary} />
                ) : (
                  <Eye size={20} color={colors.text.tertiary} />
                )}
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Lock size={20} color={colors.text.tertiary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Potwierdź hasło"
                placeholderTextColor={colors.text.tertiary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
            </View>

            {/* Error Message */}
            {displayError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            )}

            {/* Register Button */}
            <GradientButton
              label={isLoading ? 'Tworzenie konta...' : 'Zarejestruj się'}
              onPress={handleRegister}
              disabled={isLoading}
              fullWidth
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Masz już konto?{' '}
              <Text 
                style={styles.link} 
                onPress={() => router.replace('/(auth)/login')}
              >
                Zaloguj się
              </Text>
            </Text>

            <Text style={styles.legalText}>
              Rejestrując się, akceptujesz{' '}
              <Text style={styles.link}>Regulamin</Text> i{' '}
              <Text style={styles.link}>Politykę Prywatności</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  backButton: {
    padding: spacing[2],
    marginLeft: -spacing[2],
  },
  logoSmall: {
    marginLeft: 'auto',
  },
  logoGradientSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.styles.h1,
    marginBottom: spacing[2],
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.text.secondary,
    marginBottom: spacing[8],
  },
  form: {
    gap: spacing[4],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    paddingHorizontal: spacing[4],
  },
  inputIcon: {
    marginRight: spacing[3],
  },
  input: {
    flex: 1,
    height: 52,
    color: colors.text.primary,
    ...typography.styles.body,
  },
  eyeButton: {
    padding: spacing[2],
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: spacing[3],
  },
  errorText: {
    color: '#EF4444',
    ...typography.styles.bodySmall,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: spacing[4],
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing[8],
    alignItems: 'center',
    gap: spacing[4],
  },
  footerText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  link: {
    color: colors.green.primary,
    fontWeight: '600',
  },
  legalText: {
    ...typography.styles.caption,
    textAlign: 'center',
    color: colors.text.tertiary,
    paddingHorizontal: spacing[4],
  },
});

