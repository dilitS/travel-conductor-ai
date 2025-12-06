import React, { useState } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { colors, layout, spacing, typography } from '@/theme';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export function Input({
  label,
  error,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isSecure = isPassword && !showPassword;
  
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          error ? styles.error : null,
        ]}
      >
        {LeftIcon && (
          <LeftIcon
            size={20}
            color={colors.text.tertiary}
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isSecure}
          selectionColor={colors.green.primary}
          {...props}
        />
        
        {isPassword ? (
          <TouchableOpacity onPress={handleTogglePassword} style={styles.rightIcon}>
            {showPassword ? (
              <EyeOff size={20} color={colors.text.tertiary} />
            ) : (
              <Eye size={20} color={colors.text.tertiary} />
            )}
          </TouchableOpacity>
        ) : RightIcon ? (
          <TouchableOpacity onPress={onRightIconPress} style={styles.rightIcon}>
            <RightIcon size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing[4],
  },
  label: {
    ...typography.styles.label,
    marginBottom: spacing[2],
    marginLeft: spacing[1],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.input,
    borderRadius: layout.radius.md,
    borderWidth: 1,
    borderColor: 'transparent',
    height: 56,
    paddingHorizontal: spacing[4],
  },
  input: {
    flex: 1,
    color: colors.text.primary,
    ...typography.styles.body,
    height: '100%',
  },
  focused: {
    borderColor: colors.green.primary,
    backgroundColor: colors.background.tertiary,
  },
  error: {
    borderColor: colors.semantic.error,
  },
  leftIcon: {
    marginRight: spacing[3],
  },
  rightIcon: {
    marginLeft: spacing[3],
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.semantic.error,
    marginTop: spacing[1],
    marginLeft: spacing[1],
  },
});

