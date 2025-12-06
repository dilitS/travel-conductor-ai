import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { CreatorLayout } from '@/components/creator';
import { GradientButton, Button } from '@/components/ui';
import { colors, spacing, typography, layout } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';

const MAX_CHARS = 200;

export default function CreatorStep5() {
  const router = useRouter();
  const { setNotes, draft, setStep } = useCreatorStore();
  const [text, setText] = useState(draft.notes);

  React.useEffect(() => {
    setStep(6);
  }, []);

  const handleGenerate = () => {
    setNotes(text);
    router.push('/creator/generating');
  };

  return (
    <CreatorLayout title="Notatki">
      <View style={styles.container}>
        <Text style={styles.heading}>Dodatkowe informacje</Text>
        <Text style={styles.subheading}>Co jeszcze powinniśmy wiedzieć?</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            numberOfLines={6}
            placeholder="Np. unikaj muzeów, lubię kuchnię wegańską..."
            placeholderTextColor={colors.text.tertiary}
            value={text}
            onChangeText={(val) => {
              if (val.length <= MAX_CHARS) setText(val);
            }}
            textAlignVertical="top"
          />
          <Text style={styles.counter}>
            {text.length}/{MAX_CHARS}
          </Text>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Stwórz plan podróży"
            onPress={handleGenerate}
            fullWidth
          />
        </View>
      </View>
    </CreatorLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing[4],
  },
  heading: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing[2],
  },
  subheading: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    marginBottom: spacing[6],
  },
  inputContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: layout.radius.lg,
    padding: spacing[4],
    height: 200,
  },
  input: {
    flex: 1,
    ...typography.styles.body,
    color: colors.text.primary,
    padding: 0, // remove default padding
  },
  counter: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing[2],
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
    gap: spacing[3],
  },
});
