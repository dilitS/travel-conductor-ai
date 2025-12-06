import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { colors, spacing, typography, layout } from '@/theme';

interface ChatBubbleProps {
  text?: string;
  isUser?: boolean;
  children?: React.ReactNode;
}

export function ChatBubble({ text, isUser = false, children }: ChatBubbleProps) {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.aiContainer]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: 'https://ui-avatars.com/api/?name=AI&background=10B981&color=fff' }}
            style={styles.avatar}
            contentFit="cover"
          />
        </View>
      )}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        {text && (
          <Text style={[styles.text, isUser ? styles.userText : styles.aiText]}>
            {text}
          </Text>
        )}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing[4],
    maxWidth: '85%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  aiContainer: {
    alignSelf: 'flex-start',
  },
  avatarContainer: {
    marginRight: spacing[2],
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background.tertiary,
  },
  bubble: {
    padding: spacing[3],
    borderRadius: layout.radius.lg,
    minWidth: 60,
  },
  userBubble: {
    backgroundColor: colors.green.primary,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: colors.background.tertiary,
    borderBottomLeftRadius: 4,
  },
  text: {
    ...typography.styles.body,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: colors.text.primary,
  },
});

