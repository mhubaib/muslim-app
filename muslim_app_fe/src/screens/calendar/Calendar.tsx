import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles, calendarTheme } from './calendar-style';
import {
  toHijri,
  getIslamicMonthName,
  getUpcomingEvents,
  HijriDate,
} from '../../utils/hijri';

// Configure Indonesian Locale
LocaleConfig.locales.id = {
  monthNames: [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ],
  monthNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Ags',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'],
  today: 'Hari ini',
};
LocaleConfig.defaultLocale = 'id';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);

  useEffect(() => {
    const date = new Date(selectedDate);
    setHijriDate(toHijri(date));
  }, [selectedDate]);

  const markedDates = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        selectedColor: '#4CAF50',
        selectedTextColor: 'white',
      },
    };
  }, [selectedDate]);

  const upcomingEvents = useMemo(() => {
    if (!hijriDate) return [];
    return getUpcomingEvents(hijriDate, 10);
  }, [hijriDate]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Calendar
        current={selectedDate}
        onDayPress={(day: { dateString: string }) => {
          setSelectedDate(day.dateString);
        }}
        firstDay={1}
        markedDates={markedDates}
        theme={calendarTheme}
        renderArrow={(direction: 'left' | 'right') => (
          <Ionicons
            name={direction === 'left' ? 'chevron-back' : 'chevron-forward'}
            size={24}
            color="white"
          />
        )}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {hijriDate
            ? `${hijriDate.day} ${getIslamicMonthName(hijriDate.month)} ${
                hijriDate.year
              } H`
            : 'Memuat...'}
        </Text>
        <Text style={styles.headerSubtitle}>Tanggal Hijriah Terpilih</Text>
      </View>

      <ScrollView contentContainerStyle={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>
          Moment Penting Islam (Mendatang)
        </Text>

        <View style={styles.eventList}>
          {upcomingEvents.map((event, index) => (
            <View key={index} style={styles.eventItem}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>
                {event.day} {getIslamicMonthName(event.month)} {event.year} H
              </Text>
              <Text style={styles.eventDescription}>{event.description}</Text>
            </View>
          ))}

          {upcomingEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Tidak ada event dalam waktu dekat
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
