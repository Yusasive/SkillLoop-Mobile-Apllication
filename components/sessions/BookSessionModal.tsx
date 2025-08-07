import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ScrollView, TextInput } from 'react-native';
import { X, Calendar, Clock, DollarSign, User } from 'lucide-react-native';
import { Calendar as CalendarComponent } from 'react-native-calendars';

interface BookSessionModalProps {
  visible: boolean;
  onClose: () => void;
}

export const BookSessionModal: React.FC<BookSessionModalProps> = ({
  visible,
  onClose,
}) => {
  const colorScheme = useColorScheme();
  const [step, setStep] = useState(1);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const durationOptions = [30, 60, 90, 120];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBookSession = () => {
    // Implement booking logic
    console.log('Booking session:', {
      selectedTutor,
      selectedDate,
      selectedTime,
      duration,
      notes,
    });
    onClose();
  };

  const styles = createStyles(colorScheme === 'dark');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colorScheme === 'dark' ? '#ffffff' : '#374151'} />
          </TouchableOpacity>
          <Text style={styles.title}>Book Session</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{step}/4</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <User size={24} color="#3b82f6" />
                <Text style={styles.stepTitle}>Select Tutor</Text>
              </View>
              <Text style={styles.stepDescription}>
                Choose a tutor for your learning session
              </Text>
              {/* Tutor selection would go here */}
              <View style={styles.placeholder}>
                <Text style={styles.placeholderText}>Tutor selection component</Text>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Calendar size={24} color="#3b82f6" />
                <Text style={styles.stepTitle}>Select Date</Text>
              </View>
              <Text style={styles.stepDescription}>
                Choose your preferred date for the session
              </Text>
              
              <CalendarComponent
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={{
                  [selectedDate]: { selected: true, selectedColor: '#3b82f6' }
                }}
                minDate={new Date().toISOString().split('T')[0]}
                theme={{
                  backgroundColor: isDark ? '#1f2937' : '#ffffff',
                  calendarBackground: isDark ? '#1f2937' : '#ffffff',
                  textSectionTitleColor: isDark ? '#9ca3af' : '#6b7280',
                  selectedDayBackgroundColor: '#3b82f6',
                  selectedDayTextColor: '#ffffff',
                  todayTextColor: '#3b82f6',
                  dayTextColor: isDark ? '#ffffff' : '#111827',
                  textDisabledColor: isDark ? '#4b5563' : '#d1d5db',
                  arrowColor: '#3b82f6',
                  monthTextColor: isDark ? '#ffffff' : '#111827',
                }}
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <Clock size={24} color="#3b82f6" />
                <Text style={styles.stepTitle}>Select Time & Duration</Text>
              </View>
              <Text style={styles.stepDescription}>
                Choose your preferred time and session duration
              </Text>
              
              <View style={styles.timeSection}>
                <Text style={styles.sectionLabel}>Available Times</Text>
                <View style={styles.timeSlotsGrid}>
                  {timeSlots.map((time) => (
                    <TouchableOpacity
                      key={time}
                      style={[
                        styles.timeSlot,
                        selectedTime === time && styles.selectedTimeSlot,
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeSlotText,
                        selectedTime === time && styles.selectedTimeSlotText,
                      ]}>
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.durationSection}>
                <Text style={styles.sectionLabel}>Duration</Text>
                <View style={styles.durationOptions}>
                  {durationOptions.map((dur) => (
                    <TouchableOpacity
                      key={dur}
                      style={[
                        styles.durationOption,
                        duration === dur && styles.selectedDuration,
                      ]}
                      onPress={() => setDuration(dur)}
                    >
                      <Text style={[
                        styles.durationText,
                        duration === dur && styles.selectedDurationText,
                      ]}>
                        {dur} min
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          )}

          {step === 4 && (
            <View style={styles.stepContainer}>
              <View style={styles.stepHeader}>
                <DollarSign size={24} color="#3b82f6" />
                <Text style={styles.stepTitle}>Review & Confirm</Text>
              </View>
              <Text style={styles.stepDescription}>
                Review your session details and add any notes
              </Text>
              
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Session Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Date:</Text>
                  <Text style={styles.summaryValue}>
                    {selectedDate ? new Date(selectedDate).toLocaleDateString() : 'Not selected'}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Time:</Text>
                  <Text style={styles.summaryValue}>{selectedTime || 'Not selected'}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Duration:</Text>
                  <Text style={styles.summaryValue}>{duration} minutes</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total Cost:</Text>
                  <Text style={styles.summaryPrice}>$50.00</Text>
                </View>
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.sectionLabel}>Session Notes (Optional)</Text>
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add any specific topics or goals for this session..."
                  placeholderTextColor={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step > 1 && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.nextButton, step === 1 && styles.fullWidthButton]} 
            onPress={step === 4 ? handleBookSession : handleNext}
          >
            <Text style={styles.nextButtonText}>
              {step === 4 ? 'Book Session' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#e5e7eb',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  stepIndicator: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  stepContainer: {
    paddingVertical: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  stepDescription: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    marginBottom: 24,
    lineHeight: 20,
  },
  placeholder: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
  },
  placeholderText: {
    color: isDark ? '#9ca3af' : '#6b7280',
    fontSize: 14,
  },
  timeSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 12,
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTimeSlot: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeSlotText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  durationSection: {
    marginBottom: 24,
  },
  durationOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  durationOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedDuration: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  durationText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  selectedDurationText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  summaryLabel: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#111827',
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  notesSection: {
    marginBottom: 24,
  },
  notesInput: {
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: isDark ? '#ffffff' : '#111827',
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  fullWidthButton: {
    flex: 2,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});