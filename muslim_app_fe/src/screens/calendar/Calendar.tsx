import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@react-native-vector-icons/ionicons';
import { styles, calendarTheme } from './calendar-style';
import { toHijri, getIslamicMonthName, HijriDate } from '../../utils/hijri';
import { getAllEvents } from '../../api/event';
import { IslamicEvent } from '../../types/Event';

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
  const [events, setEvents] = useState<IslamicEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const date = new Date(selectedDate);
    setHijriDate(toHijri(date));
  }, [selectedDate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  const markedDates = useMemo(() => {
    const marks: any = {
      [selectedDate]: {
        selected: true,
        selectedColor: '#14be86',
        selectedTextColor: 'white',
      },
    };

    events.forEach(event => {
      if (event.estimatedGregorian) {
        const dateStr = new Date(event.estimatedGregorian)
          .toISOString()
          .split('T')[0];

        // Don't overwrite selected date style, just add dot if it's selected
        if (marks[dateStr]) {
          marks[dateStr].marked = true;
          marks[dateStr].dotColor = marks[dateStr].selected
            ? 'white'
            : '#14be86';
        } else {
          marks[dateStr] = {
            marked: true,
            dotColor: '#14be86',
          };
        }
      }
    });

    return marks;
  }, [selectedDate, events]);

  const selectedDateEvents = useMemo(() => {
    return events.filter(event => {
      if (!event.estimatedGregorian) return false;
      const eventDate = new Date(event.estimatedGregorian)
        .toISOString()
        .split('T')[0];
      return eventDate === selectedDate;
    });
  }, [selectedDate, events]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {hijriDate
            ? `${hijriDate.day} ${getIslamicMonthName(hijriDate.month)} ${
                hijriDate.year
              } H`
            : 'Memuat...'}
        </Text>
      </View>

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
        enableSwipeMonths
      />

      <ScrollView contentContainerStyle={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Events Islam</Text>

        <View style={styles.eventList}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color="#14be86"
              style={styles.loader}
            />
          ) : selectedDateEvents.length > 0 ? (
            selectedDateEvents.map((event, index) => (
              <View key={index} style={styles.eventItem}>
                <Text style={styles.eventTitle}>{event.name}</Text>
                <Text style={styles.eventDate}>{event.dateHijri}</Text>
                {event.description && (
                  <Text style={styles.eventDescription}>
                    {event.description}
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="archive-outline" size={50} color="#14be86" />
              <Text style={styles.emptyStateText}>
                Tidak ada event pada tanggal ini
              </Text>
            </View>
          )}
        </View>
        <View style={styles.emptyState} />
      </ScrollView>
    </SafeAreaView>
  );
}
