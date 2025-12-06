import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { colors, spacing, typography, layout } from '@/theme';
import { ChatBubble, ChatInput, PlanPreview } from '@/components/chat';
import { TouchableOpacity } from 'react-native';

interface Message {
  id: string;
  text?: string;
  isUser: boolean;
  preview?: {
    title: string;
    description: string;
  };
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', text: 'Cześć! Jestem Twoim asystentem podróży. Co chciałbyś zmienić w planie?', isUser: false },
];

export default function EditTripAIScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    // Mock AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        isUser: false,
        text: 'Zrozumiałem. Proponuję następującą zmianę:',
        preview: {
          title: 'Dodanie kolacji',
          description: 'Restauracja Jules Verne na Wieży Eiffla (19:00). Czas trwania: 2h. Koszt: $$$$.',
        },
      };
      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
    }, 1500);
  };

  const handleConfirm = () => {
    const successMsg: Message = {
      id: Date.now().toString(),
      isUser: false,
      text: 'Plan został zaktualizowany! Czy mogę jeszcze w czymś pomóc?',
    };
    setMessages((prev) => [...prev, successMsg]);
  };

  const handleCancel = () => {
     const cancelMsg: Message = {
      id: Date.now().toString(),
      isUser: false,
      text: 'Anulowano zmianę.',
    };
    setMessages((prev) => [...prev, cancelMsg]);
  };

  function handleBack() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(drawer)');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edytor AI</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContent}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} text={msg.text} isUser={msg.isUser}>
              {msg.preview && (
                <PlanPreview
                  title={msg.preview.title}
                  description={msg.preview.description}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              )}
            </ChatBubble>
          ))}
          {loading && (
            <ChatBubble text="..." isUser={false} />
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <ChatInput
            value={inputText}
            onChangeText={setInputText}
            onSend={handleSend}
            loading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    height: layout.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.default,
  },
  backButton: {
    padding: spacing[1],
  },
  headerTitle: {
    ...typography.styles.h4,
    color: colors.text.primary,
  },
  keyboardView: {
    flex: 1,
  },
  messagesContent: {
    padding: layout.screenPadding,
    paddingBottom: spacing[4],
  },
  inputContainer: {
    padding: layout.screenPadding,
    paddingTop: spacing[2],
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
    backgroundColor: colors.background.primary,
  },
});

