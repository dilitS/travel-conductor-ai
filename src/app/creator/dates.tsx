import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, DateData } from 'react-native-calendars';

// Type for calendar marked dates
type MarkedDates = Record<string, {
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
  textColor?: string;
}>;
import { CreatorLayout } from '@/components/creator';
import { GradientButton } from '@/components/ui';
import { colors, spacing, typography, layout } from '@/theme';
import { useCreatorStore } from '@/stores/creatorStore';
import { differenceInDays, parseISO, format } from 'date-fns';
import { pl } from 'date-fns/locale';

export default function CreatorStep2() {
  const router = useRouter();
  const { setDates, nextStep, draft, setStep } = useCreatorStore();
  
  React.useEffect(() => {
    setStep(2);
  }, []);
  
  // Local state for selection
  const [startDate, setStartDate] = useState<string | null>(
    draft.dates.startDate ? format(draft.dates.startDate, 'yyyy-MM-dd') : null
  );
  const [endDate, setEndDate] = useState<string | null>(
    draft.dates.endDate ? format(draft.dates.endDate, 'yyyy-MM-dd') : null
  );

  const handleDayPress = (day: DateData) => {
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(day.dateString);
      setEndDate(null);
    } else if (startDate && !endDate) {
      // Select end date
      if (day.dateString < startDate) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const getMarkedDates = () => {
    const marked: MarkedDates = {};
    if (startDate) {
      marked[startDate] = { startingDay: true, color: colors.green.primary, textColor: 'white' };
      if (endDate) {
        marked[endDate] = { endingDay: true, color: colors.green.primary, textColor: 'white' };
        
        // Fill in between (simplified logic, assuming sorted)
        // In real implementation, loop through days
        // For now, react-native-calendars period marking handles start/end well visually
        // But filling requires list of dates.
        // Let's just mark start and end for MVP simplicity or use simple logic if needed.
        // Better: Iterate days.
        let curr = new Date(startDate);
        const end = new Date(endDate);
        while (curr < end) {
            curr.setDate(curr.getDate() + 1);
            const dateStr = curr.toISOString().split('T')[0];
            if (dateStr < endDate) {
                marked[dateStr] = { color: colors.green.soft, textColor: colors.text.primary };
            }
        }
      } else {
          marked[startDate] = { startingDay: true, endingDay: true, color: colors.green.primary, textColor: 'white' };
      }
    }
    return marked;
  };

  const handleNext = () => {
    if (startDate && endDate) {
      setDates(new Date(startDate), new Date(endDate));
      nextStep();
      router.push('/creator/people');
    }
  };

  const daysCount = startDate && endDate 
    ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1 
    : 0;

  return (
    <CreatorLayout title="Daty">
      <View style={styles.container}>
        <Text style={styles.heading}>Kiedy jedziesz?</Text>
        
        <Calendar
          onDayPress={handleDayPress}
          markedDates={getMarkedDates()}
          markingType={'period'}
          theme={{
            calendarBackground: colors.background.secondary,
            textSectionTitleColor: colors.text.secondary,
            selectedDayBackgroundColor: colors.green.primary,
            selectedDayTextColor: '#ffffff',
            todayTextColor: colors.green.primary,
            dayTextColor: colors.text.primary,
            textDisabledColor: colors.text.tertiary,
            arrowColor: colors.green.primary,
            monthTextColor: colors.text.primary,
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: 'normal',
          }}
          style={styles.calendar}
        />

        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            {startDate && endDate 
              ? `${daysCount} dni: ${format(parseISO(startDate), 'd MMM', { locale: pl })} - ${format(parseISO(endDate), 'd MMM', { locale: pl })}`
              : 'Wybierz datę przyjazdu i wyjazdu'}
          </Text>
        </View>

        <View style={styles.footer}>
          <GradientButton
            label="Dalej"
            onPress={handleNext}
            disabled={!startDate || !endDate}
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
    marginBottom: spacing[6],
  },
  calendar: {
    borderRadius: layout.radius.lg,
    paddingBottom: spacing[2],
  },
  summary: {
    marginTop: spacing[6],
    padding: spacing[4],
    backgroundColor: colors.background.tertiary,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    marginBottom: 100, // Space for fixed footer
  },
  summaryText: {
    ...typography.styles.body,
    color: colors.text.primary,
  },
  footer: {
    position: 'absolute',
    bottom: spacing[4],
    left: 0,
    right: 0,
  },
});
