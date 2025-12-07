import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/theme';
import { ArrowLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Polityka Prywatności',
          headerStyle: { backgroundColor: colors.background.primary },
          headerTintColor: colors.text.primary,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text.primary} />
            </Pressable>
          ),
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Polityka Prywatności</Text>
        <Text style={styles.lastUpdated}>Ostatnia aktualizacja: 6 grudnia 2025</Text>

        <Text style={styles.sectionTitle}>1. Administrator Danych</Text>
        <Text style={styles.paragraph}>
          Administratorem Twoich danych osobowych jest TravelAI Guide. Kontakt: kontakt@travelai.guide
        </Text>

        <Text style={styles.sectionTitle}>2. Jakie Dane Zbieramy</Text>
        <Text style={styles.paragraph}>
          • Dane konta: adres e-mail, nazwa użytkownika, zdjęcie profilowe (opcjonalnie){'\n'}
          • Dane podróży: destynacje, daty, preferencje, zainteresowania{'\n'}
          • Dane lokalizacji: współrzędne GPS podczas korzystania z przewodnika głosowego{'\n'}
          • Dane płatności: obsługiwane przez Stripe (nie przechowujemy danych kart)
        </Text>

        <Text style={styles.sectionTitle}>3. Cel Przetwarzania</Text>
        <Text style={styles.paragraph}>
          • Świadczenie usług: generowanie planów podróży, przewodnik głosowy{'\n'}
          • Personalizacja: dopasowanie rekomendacji do Twoich preferencji{'\n'}
          • Komunikacja: powiadomienia o aktualizacjach, wsparcie techniczne{'\n'}
          • Płatności: obsługa subskrypcji Premium
        </Text>

        <Text style={styles.sectionTitle}>4. Udostępnianie Danych</Text>
        <Text style={styles.paragraph}>
          Twoje dane mogą być udostępniane:{'\n'}
          • Google (Firebase, Maps API) - infrastruktura i usługi mapowe{'\n'}
          • Stripe - obsługa płatności{'\n'}
          • Unsplash - zdjęcia miejsc{'\n'}
          Nie sprzedajemy Twoich danych osobowych.
        </Text>

        <Text style={styles.sectionTitle}>5. Lokalizacja GPS</Text>
        <Text style={styles.paragraph}>
          Dane lokalizacji są zbierane wyłącznie podczas aktywnej sesji przewodnika głosowego. 
          Nie przechowujemy historii lokalizacji - tylko ostatnią pozycję podczas sesji. 
          Po zakończeniu sesji dane lokalizacji są usuwane.
        </Text>

        <Text style={styles.sectionTitle}>6. Twoje Prawa (RODO)</Text>
        <Text style={styles.paragraph}>
          Masz prawo do:{'\n'}
          • Dostępu do swoich danych{'\n'}
          • Sprostowania nieprawidłowych danych{'\n'}
          • Usunięcia danych ("prawo do bycia zapomnianym"){'\n'}
          • Ograniczenia przetwarzania{'\n'}
          • Przenoszenia danych{'\n'}
          • Sprzeciwu wobec przetwarzania{'\n\n'}
          Aby skorzystać z tych praw, skontaktuj się z nami: kontakt@travelai.guide
        </Text>

        <Text style={styles.sectionTitle}>7. Bezpieczeństwo</Text>
        <Text style={styles.paragraph}>
          Stosujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych, 
          w tym szyfrowanie, kontrolę dostępu i regularne audyty bezpieczeństwa.
        </Text>

        <Text style={styles.sectionTitle}>8. Okres Przechowywania</Text>
        <Text style={styles.paragraph}>
          Dane przechowujemy przez okres korzystania z usługi oraz przez okres wymagany przepisami prawa. 
          Po usunięciu konta dane są trwale usuwane w ciągu 30 dni.
        </Text>

        <Text style={styles.sectionTitle}>9. Kontakt</Text>
        <Text style={styles.paragraph}>
          W przypadku pytań dotyczących prywatności:{'\n'}
          E-mail: kontakt@travelai.guide
        </Text>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.text.muted,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text.secondary,
  },
  spacer: {
    height: 40,
  },
});

