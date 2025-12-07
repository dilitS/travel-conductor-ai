import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { GradientButton } from '@/components/ui';
import { colors, gradients, spacing, typography, layout } from '@/theme';
import { useAuthStore } from '@/stores/authStore';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const { 
    signInWithGoogle, 
    signInWithEmail, 
    resetPassword,
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.05, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  const handleGoogleLogin = async () => {
    clearError();
    // For now, use Firebase popup on all platforms
    // Native Google Sign-In will be implemented with development build
    await signInWithGoogle();
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) return;
    clearError();
    await signInWithEmail(email.trim(), password);
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      // Show error - need email
      return;
    }
    clearError();
    await resetPassword(email.trim());
    setResetEmailSent(true);
  };

  // Show email login form
  if (isEmailMode) {
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
                onPress={() => {
                  setIsEmailMode(false);
                  clearError();
                  setResetEmailSent(false);
                }} 
                style={styles.backButton}
              >
                <Text style={styles.backText}>← Wróć</Text>
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
            <Text style={styles.title}>Zaloguj się</Text>
            <Text style={styles.subtitle}>Witaj ponownie w TravelAI Guide</Text>

            {/* Form */}
            <View style={styles.form}>
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
                  placeholder="Hasło"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="current-password"
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

              {/* Forgot Password */}
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Zapomniałeś hasła?</Text>
              </TouchableOpacity>

              {/* Reset Email Sent */}
              {resetEmailSent && (
                <View style={styles.successContainer}>
                  <Text style={styles.successText}>
                    Link do resetowania hasła został wysłany na {email}
                  </Text>
                </View>
              )}

              {/* Error Message */}
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Login Button */}
              <GradientButton
                label={isLoading ? 'Logowanie...' : 'Zaloguj się'}
                onPress={handleEmailLogin}
                disabled={isLoading || !email.trim() || !password}
                fullWidth
                style={styles.loginButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Nie masz konta?{' '}
                <Text 
                  style={styles.link} 
                  onPress={() => router.push('/(auth)/register')}
                >
                  Zarejestruj się
                </Text>
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }

  // Main login screen with options
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.background.colors}
        start={gradients.background.start}
        end={gradients.background.end}
        style={styles.background}
      />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Animated.View style={[styles.logoCircle, logoStyle]}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.logoGradient}
            >
              <MapPin size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>
          
          <Text style={styles.titleMain}>TravelAI Guide</Text>
          <Text style={styles.subtitleMain}>Twój inteligentny przewodnik podróży</Text>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorContainerMain}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.footerMain}>
          {/* Google Sign In */}
          <GradientButton
            label={isLoading ? 'Logowanie...' : 'Kontynuuj z Google'}
            icon={Mail}
            onPress={handleGoogleLogin}
            disabled={isLoading}
            fullWidth
            style={styles.button}
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>lub</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Email Sign In */}
          <TouchableOpacity 
            style={styles.emailButton}
            onPress={() => setIsEmailMode(true)}
          >
            <Mail size={20} color={colors.text.primary} />
            <Text style={styles.emailButtonText}>Kontynuuj z Email</Text>
          </TouchableOpacity>

          {/* Register Link */}
          <Text style={styles.registerText}>
            Nie masz konta?{' '}
            <Text 
              style={styles.link} 
              onPress={() => router.push('/(auth)/register')}
            >
              Zarejestruj się
            </Text>
          </Text>

          <Text style={styles.legalText}>
            Kontynuując, akceptujesz{' '}
            <Text style={styles.link}>Regulamin</Text> i{' '}
            <Text style={styles.link}>Politykę Prywatności</Text>
          </Text>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: layout.screenPadding,
    paddingTop: 120,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing[6],
    shadowColor: colors.green.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  titleMain: {
    ...typography.styles.h1,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  subtitleMain: {
    ...typography.styles.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  errorContainerMain: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    padding: spacing[3],
    marginHorizontal: spacing[4],
  },
  footerMain: {
    width: '100%',
    alignItems: 'center',
    gap: spacing[4],
  },
  button: {
    marginBottom: spacing[2],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: spacing[2],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.default,
  },
  dividerText: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    paddingHorizontal: spacing[4],
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 52,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border.default,
    gap: spacing[2],
  },
  emailButtonText: {
    ...typography.styles.body,
    color: colors.text.primary,
    fontWeight: '600',
  },
  registerText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
  legalText: {
    ...typography.styles.caption,
    textAlign: 'center',
    color: colors.text.tertiary,
    paddingHorizontal: spacing[4],
  },
  link: {
    color: colors.green.primary,
    fontWeight: '600',
  },
  // Email form styles
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
  backText: {
    ...typography.styles.body,
    color: colors.text.secondary,
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
  forgotPassword: {
    ...typography.styles.bodySmall,
    color: colors.green.primary,
    textAlign: 'right',
  },
  successContainer: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 8,
    padding: spacing[3],
  },
  successText: {
    color: colors.green.primary,
    ...typography.styles.bodySmall,
    textAlign: 'center',
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
  loginButton: {
    marginTop: spacing[4],
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing[8],
    alignItems: 'center',
  },
  footerText: {
    ...typography.styles.body,
    color: colors.text.secondary,
  },
});
