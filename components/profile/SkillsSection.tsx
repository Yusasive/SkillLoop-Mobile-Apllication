import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView } from 'react-native';
import { BookOpen, Lightbulb, Plus } from 'lucide-react-native';

interface SkillsSectionProps {
  teachingSkills: string[];
  learningSkills: string[];
  onEditSkills: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  teachingSkills,
  learningSkills,
  onEditSkills,
}) => {
  const colorScheme = useColorScheme();
  const styles = createStyles(colorScheme === 'dark');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Skills</Text>
        <TouchableOpacity onPress={onEditSkills}>
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.skillsContainer}>
        <View style={styles.skillCategory}>
          <View style={styles.categoryHeader}>
            <BookOpen size={18} color="#10b981" />
            <Text style={styles.categoryTitle}>Teaching</Text>
          </View>
          
          {teachingSkills.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.skillsList}
            >
              {teachingSkills.map((skill, index) => (
                <View key={index} style={[styles.skillTag, styles.teachingSkill]}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.addSkillButton} onPress={onEditSkills}>
              <Plus size={16} color="#10b981" />
              <Text style={styles.addSkillText}>Add teaching skills</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.skillCategory}>
          <View style={styles.categoryHeader}>
            <Lightbulb size={18} color="#f59e0b" />
            <Text style={styles.categoryTitle}>Learning</Text>
          </View>
          
          {learningSkills.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.skillsList}
            >
              {learningSkills.map((skill, index) => (
                <View key={index} style={[styles.skillTag, styles.learningSkill]}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity style={styles.addSkillButton} onPress={onEditSkills}>
              <Plus size={16} color="#f59e0b" />
              <Text style={styles.addSkillText}>Add learning interests</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const createStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: isDark ? '#ffffff' : '#111827',
  },
  editText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  skillsContainer: {
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillCategory: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? '#ffffff' : '#111827',
  },
  skillsList: {
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  teachingSkill: {
    backgroundColor: isDark ? '#064e3b' : '#d1fae5',
    borderColor: '#10b981',
  },
  learningSkill: {
    backgroundColor: isDark ? '#451a03' : '#fef3c7',
    borderColor: '#f59e0b',
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
    color: isDark ? '#ffffff' : '#111827',
  },
  addSkillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: isDark ? '#374151' : '#f9fafb',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: isDark ? '#4b5563' : '#e5e7eb',
    borderStyle: 'dashed',
    gap: 8,
  },
  addSkillText: {
    fontSize: 14,
    color: isDark ? '#9ca3af' : '#6b7280',
    fontWeight: '500',
  },
});