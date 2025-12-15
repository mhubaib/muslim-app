import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20493bff',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  calendarContainer: {
    backgroundColor: '#20493bff', // Match background
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  eventList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50', // Accent color
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: 10,
  },
  empty: {
    height: 100,
  }
});

export const calendarTheme = {
  calendarBackground: 'transparent',
  textSectionTitleColor: 'rgba(255,255,255,0.6)',
  selectedDayBackgroundColor: '#4CAF50',
  selectedDayTextColor: '#ffffff',
  todayTextColor: '#4CAF50',
  dayTextColor: '#ffffff',
  textDisabledColor: 'rgba(255,255,255,0.2)',
  dotColor: '#4CAF50',
  selectedDotColor: '#ffffff',
  arrowColor: '#ffffff',
  monthTextColor: '#ffffff',
  textDayFontWeight: '400' as const,
  textMonthFontWeight: 'bold' as const,
  textDayHeaderFontWeight: '400' as const,
  textDayFontSize: 14,
  textMonthFontSize: 16,
  textDayHeaderFontSize: 14,
};
