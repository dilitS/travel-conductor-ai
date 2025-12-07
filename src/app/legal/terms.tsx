import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors } from '@/theme';
import { ArrowLeft } from 'lucide-react-native';

export default function TermsOfServiceScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Regulamin',
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
        <Text style={styles.title}>Regulamin Usługi</Text>
        <Text style={styles.lastUpdated}>Ostatnia aktualizacja: 6 grudnia 2025</Text>

        <Text style={styles.sectionTitle}>1. Postanowienia Ogólne</Text>
        <Text style={styles.paragraph}>
          Niniejszy regulamin określa zasady korzystania z aplikacji TravelAI Guide ("Usługa"). 
          Korzystając z Usługi, akceptujesz niniejszy regulamin.
        </Text>

        <Text style={styles.sectionTitle}>2. Opis Usługi</Text>
        <Text style={styles.paragraph}>
          TravelAI Guide to aplikacja do planowania podróży z wykorzystaniem sztucznej inteligencji. 
          Usługa umożliwia:{'\n'}
          • Generowanie spersonalizowanych planów podróży{'\n'}
          • Korzystanie z przewodnika głosowego GPS{'\n'}
          • Przeglądanie i udostępnianie planów społeczności{'\n'}
          • Edycję planów w czasie rzeczywistym z AI
        </Text>

        <Text style={styles.sectionTitle}>3. Konto Użytkownika</Text>
        <Text style={styles.paragraph}>
          • Musisz mieć ukończone 16 lat, aby korzystać z Usługi{'\n'}
          • Jesteś odpowiedzialny za bezpieczeństwo swojego konta{'\n'}
          • Jedno konto na osobę{'\n'}
          • Podane dane muszą być prawdziwe
        </Text>

        <Text style={styles.sectionTitle}>4. Plany i Subskrypcje</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Plan Darmowy (Free):</Text>{'\n'}
          • 1 plan podróży{'\n'}
          • Przeglądanie planów społeczności{'\n'}
          • Głosowanie na plany{'\n\n'}
          <Text style={styles.bold}>Plan Premium (29,99 zł/miesiąc):</Text>{'\n'}
          • Nielimitowane plany podróży{'\n'}
          • Przewodnik głosowy GPS{'\n'}
          • Edycja planu z AI{'\n'}
          • Kopiowanie planów społeczności{'\n'}
          • Plan na deszcz
        </Text>

        <Text style={styles.sectionTitle}>5. Płatności</Text>
        <Text style={styles.paragraph}>
          • Płatności obsługiwane są przez Stripe{'\n'}
          • Subskrypcja odnawia się automatycznie{'\n'}
          • Możesz anulować w dowolnym momencie{'\n'}
          • Brak zwrotów za rozpoczęty okres rozliczeniowy
        </Text>

        <Text style={styles.sectionTitle}>6. Treści Użytkowników</Text>
        <Text style={styles.paragraph}>
          • Publikując plan, udzielasz nam licencji na jego wyświetlanie{'\n'}
          • Nie publikuj treści nielegalnych, obraźliwych lub naruszających prawa osób trzecich{'\n'}
          • Zastrzegamy prawo do usunięcia nieodpowiednich treści
        </Text>

        <Text style={styles.sectionTitle}>7. Ograniczenie Odpowiedzialności</Text>
        <Text style={styles.paragraph}>
          • Plany generowane przez AI mają charakter informacyjny{'\n'}
          • Nie gwarantujemy dokładności godzin otwarcia, cen ani dostępności{'\n'}
          • Użytkownik podróżuje na własną odpowiedzialność{'\n'}
          • Nie ponosimy odpowiedzialności za szkody wynikłe z korzystania z Usługi
        </Text>

        <Text style={styles.sectionTitle}>8. Własność Intelektualna</Text>
        <Text style={styles.paragraph}>
          Wszelkie prawa do aplikacji, kodu, designu i treści należą do TravelAI Guide. 
          Nie możesz kopiować, modyfikować ani rozpowszechniać elementów Usługi bez zgody.
        </Text>

        <Text style={styles.sectionTitle}>9. Zmiany Regulaminu</Text>
        <Text style={styles.paragraph}>
          Możemy aktualizować regulamin. O istotnych zmianach poinformujemy z 14-dniowym wyprzedzeniem. 
          Dalsze korzystanie z Usługi oznacza akceptację zmian.
        </Text>

        <Text style={styles.sectionTitle}>10. Kontakt</Text>
        <Text style={styles.paragraph}>
          W przypadku pytań:{'\n'}
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
  bold: {
    fontWeight: '600',
    color: colors.text.primary,
  },
  spacer: {
    height: 40,
  },
});

