import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Send } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  loading?: boolean;
}

export function ChatInput({ value, onChangeText, onSend, loading = false }: ChatInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Napisz, co zmienić w planie..."
        placeholderTextColor={colors.text.tertiary}
        multiline
        maxLength={500}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!value.trim() || loading) && styles.sendButtonDisabled]}
        onPress={onSend}
        disabled={!value.trim() || loading}
        accessibilityLabel="Wyślij wiadomość"
      >
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Send size={20} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.full,
    padding: spacing[2],
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  input: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.green.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing[2],
  },
  sendButtonDisabled: {
    backgroundColor: colors.background.tertiary,
    opacity: 0.7,
  },
});

