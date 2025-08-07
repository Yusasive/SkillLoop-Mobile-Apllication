import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Modal, ScrollView, Switch } from 'react-native';
import { X, Star } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

interface Filters {
  category: string;
  minRating: number;
  maxRate: number;
  availability: 'any' | 'now' | 'today' | 'week';
  languages: string[];
  verified: boolean;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filters: Filters;
  onApplyFilters: (filters: Filters) => void;
}

const availabilityOptions = [
  { id: 'any', label: 'Any time' },
  { id: 'now', label: 'Available now' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
];

const languageOptions = [
  'English', 'Spanish', 'French', 'German', 'Italian', 
  'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'
];

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  filters,
  onApplyFilters,
}) => {
  const colorScheme = useColorScheme();
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleApply = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: Filters = {
      category: 'all',
      minRating: 0,
      maxRate: 1000,
      availability: 'any',
      languages: [],
      verified: false,
    };
    setLocalFilters(resetFilters);
  };

  const toggleLanguage = (language: string) => {
    setLocalFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language],
    }));
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
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={handleReset}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minimum Rating</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setLocalFilters(prev => ({ ...prev, minRating: star }))}
                  >
                    <Star
                      size={24}
                      color="#f59e0b"
                      fill={star <= localFilters.minRating ? "#f59e0b" : "transparent"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingText}>
                {localFilters.minRating > 0 ? `${localFilters.minRating}+ stars` : 'Any rating'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hourly Rate</Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Up to ${localFilters.maxRate}/hour</Text>
              <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={1000}
                value={localFilters.maxRate}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, maxRate: Math.round(value) }))}
                minimumTrackTintColor="#3b82f6"
                maximumTrackTintColor={colorScheme === 'dark' ? '#374151' : '#e5e7eb'}
                thumbStyle={{ backgroundColor: '#3b82f6' }}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Availability</Text>
            <View style={styles.optionsContainer}>
              {availabilityOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    localFilters.availability === option.id && styles.activeOption,
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, availability: option.id as any }))}
                >
                  <Text
                    style={[
                      styles.optionText,
                      localFilters.availability === option.id && styles.activeOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.switchRow}>
              <Text style={styles.sectionTitle}>Verified Tutors Only</Text>
              <Switch
                value={localFilters.verified}
                onValueChange={(value) => setLocalFilters(prev => ({ ...prev, verified: value }))}
                trackColor={{ false: '#374151', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={styles.languagesContainer}>
              {languageOptions.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.languageTag,
                    localFilters.languages.includes(language) && styles.activeLanguage,
                  ]}
                  onPress={() => toggleLanguage(language)}
                >
                  <Text
                    style={[
                      styles.languageText,
                      localFilters.languages.includes(language) && styles.activeLanguageText,
                    ]}
                  >
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
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
  resetText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#374151' : '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
    marginBottom: 12,
  },
  ratingContainer: {
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
  },
  sliderContainer: {
    gap: 12,
  },
  sliderLabel: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeOption: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  activeOptionText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: isDark ? '#374151' : '#f3f4f6',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeLanguage: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  languageText: {
    fontSize: 12,
    color: isDark ? '#e5e7eb' : '#374151',
    fontWeight: '500',
  },
  activeLanguageText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: isDark ? '#374151' : '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});