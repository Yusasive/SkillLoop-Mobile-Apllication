import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Clock } from 'lucide-react-native';
import { Session } from '@/store/types';

interface SessionCalendarProps {
  sessions: Session[];
}

export const SessionCalendar: React.FC<SessionCalendarProps> = ({
  sessions,
}) => {
  const colorScheme = useColorScheme();
  const [selectedDate, setSelectedDate] = useState('');

  // Create marked dates from sessions
  const markedDates = sessions.reduce((acc, session) => {
    const date = new Date(session.scheduledTime).toISOString().split('T')[0];

    if (!acc[date]) {
      acc[date] = {
        marked: true,
        dots: [],
      };
    }

    const statusColor = {
      scheduled: '#f59e0b',
      confirmed: '#10b981',
      in_progress: '#3b82f6',
      completed: '#6b7280',
      cancelled: '#ef4444',
    }[session.status];

    acc[date].dots.push({
      color: statusColor,
    });

    return acc;
  }, {} as any);

  // Add selection styling
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...markedDates[selectedDate],
      selected: true,
      selectedColor: '#3b82f6',
    };
  }

  const selectedDateSessions = sessions.filter((session) => {
    const sessionDate = new Date(session.scheduledTime)
      .toISOString()
      .split('T')[0];
    return sessionDate === selectedDate;
  });

  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          calendarBackground: isDark ? '#1f2937' : '#ffffff',
          textSectionTitleColor: isDark ? '#9ca3af' : '#6b7280',
          selectedDayBackgroundColor: '#3b82f6',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3b82f6',
          dayTextColor: isDark ? '#ffffff' : '#111827',
          textDisabledColor: isDark ? '#4b5563' : '#d1d5db',
          dotColor: '#3b82f6',
          selectedDotColor: '#ffffff',
          arrowColor: '#3b82f6',
          disabledArrowColor: isDark ? '#4b5563' : '#d1d5db',
          monthTextColor: isDark ? '#ffffff' : '#111827',
          indicatorColor: '#3b82f6',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontWeight: '400',
          textMonthFontWeight: '600',
          textDayHeaderFontWeight: '600',
          textDayFontSize: 16,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 14,
        }}
      />

      {selectedDate && selectedDateSessions.length > 0 && (
        <View style={styles.selectedDateSessions}>
          <Text style={styles.selectedDateTitle}>
            Sessions on{' '}
            {new Date(selectedDate).toLocaleDateString([], {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>

          {selectedDateSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionTime}>
                <Clock
                  size={16}
                  color={colorScheme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                <Text style={styles.timeText}>
                  {new Date(session.scheduledTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>

              <View style={styles.sessionInfo}>
                <Text style={styles.sessionTutor}>{session.tutorName}</Text>
                <Text style={styles.sessionSkill}>{session.skill}</Text>
              </View>

              <View
                style={[
                  styles.sessionStatus,
                  { backgroundColor: statusColors[session.status] },
                ]}
              >
                <Text style={styles.sessionStatusText}>
                  {statusLabels[session.status]}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
      margin: 16,
      borderRadius: 16,
      overflow: 'hidden',
    },
    selectedDateSessions: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#e5e7eb',
    },
    selectedDateTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 16,
    },
    sessionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#f3f4f6',
    },
    sessionTime: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      width: 80,
    },
    timeText: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontWeight: '500',
    },
    sessionInfo: {
      flex: 1,
      marginLeft: 12,
    },
    sessionTutor: {
      fontSize: 14,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
      marginBottom: 2,
    },
    sessionSkill: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
    },
    sessionStatus: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    sessionStatusText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '600',
    },
  });

const statusColors = {
  scheduled: '#f59e0b',
  confirmed: '#10b981',
  in_progress: '#3b82f6',
  completed: '#6b7280',
  cancelled: '#ef4444',
};

const statusLabels = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};