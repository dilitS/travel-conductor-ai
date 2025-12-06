import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/theme';

export default function CreatorScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: 'white' }}>Kreator Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

