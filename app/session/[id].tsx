import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Video, VideoOff, Mic, MicOff, Phone, MessageCircle, Share, SquareCheck as CheckSquare, Square, Camera } from 'lucide-react-native';
import VideoCallView from '../../components/session/VideoCallView';
import SessionChat from '../../components/session/SessionChat';
import AccessibilityService from '../../services/AccessibilityService';
import { AnalyticsService } from '../../services/AnalyticsService';

const analyticsService = AnalyticsService.getInstance();

interface SessionProgress {
  id: string;
  milestone: string;
  completed: boolean;
  completedAt?: string;
}

export default function SessionScreen() {
  const colorScheme = useColorScheme();
  const { id } = useLocalSearchParams();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [progress, setProgress] = useState<SessionProgress[]>([
    { id: '1', milestone: 'Introduction and goal setting', completed: false },
    { id: '2', milestone: 'Core concept explanation', completed: false },
    { id: '3', milestone: 'Hands-on practice', completed: false },
    { id: '4', milestone: 'Q&A and wrap-up', completed: false },
  ]);

  useEffect(() => {
    // Track session start
    analyticsService.track('session_started', {
      sessionId: id as string,
      timestamp: new Date().toISOString(),
    });

    // Announce session start for accessibility
    AccessibilityService.announceToScreenReader(
      'Learning session started with tutor John Smith for JavaScript Fundamentals',
    );

    return () => {
      // Track session end
      analyticsService.track('session_ended', {
        sessionId: id as string,
        duration: Date.now(),
        completed_milestones: progress.filter((p) => p.completed).length,
      });
    };
  }, []);

  const startVideoCall = async () => {
    try {
      setVideoCallActive(true);
      setSessionStarted(true);

      // Provide haptic feedback
      AccessibilityService.provideHapticFeedback('success');

      // Announce video call start
      AccessibilityService.announceToScreenReader('Video call started');

      // Track analytics
      analyticsService.track('video_call_started', {
        sessionId: id as string,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to start video call:', error);
      Alert.alert('Error', 'Failed to start video call');
    }
  };

  const endVideoCall = () => {
    Alert.alert(
      'End Video Call',
      'Are you sure you want to end the video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            setVideoCallActive(false);
            AccessibilityService.announceToScreenReader('Video call ended');
            analyticsService.track('video_call_ended', {
              sessionId: id as string,
              timestamp: new Date().toISOString(),
            });
          },
        },
      ],
    );
  };

  const toggleProgress = (progressId: string) => {
    setProgress((prev) =>
      prev.map((p) =>
        p.id === progressId
          ? {
              ...p,
              completed: !p.completed,
              completedAt: !p.completed ? new Date().toISOString() : undefined,
            }
          : p,
      ),
    );

    // Track milestone completion
    const milestone = progress.find((p) => p.id === progressId);
    if (milestone) {
      analyticsService.track('milestone_completed', {
        sessionId: id as string,
        milestoneId: progressId,
        milestone: milestone.milestone,
        timestamp: new Date().toISOString(),
      });

      // Provide accessibility feedback
      AccessibilityService.announceToScreenReader(
        `Milestone ${milestone.completed ? 'completed' : 'unchecked'}: ${milestone.milestone}`,
      );
      AccessibilityService.provideHapticFeedback('success');
    }
  };

  const toggleChat = () => {
    setChatVisible(!chatVisible);
    AccessibilityService.announceToScreenReader(
      chatVisible ? 'Chat closed' : 'Chat opened',
    );
  };

  const handleEndSession = () => {
    // End session logic
    router.back();
  };

  const completedCount = progress.filter((p) => p.completed).length;
  const progressPercentage = (completedCount / progress.length) * 100;

  const styles = createStyles(colorScheme === 'dark');

  // If video call is active, show the video call view
  if (videoCallActive) {
    return (
      <>
        <VideoCallView
          tutorId="john-smith" // This would come from session data
          sessionId={id as string}
          onEndCall={endVideoCall}
        />
        {chatVisible && (
          <SessionChat
            sessionId={id as string}
            currentUserId="current-user-id" // This would come from auth
            currentUserName="You"
            isVisible={chatVisible}
            onClose={toggleChat}
          />
        )}
      </>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.sessionInfo}>
          <Text style={styles.tutorName}>John Smith</Text>
          <Text style={styles.sessionTitle}>JavaScript Fundamentals</Text>
        </View>
        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndSession}
        >
          <Phone size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.videoContainer}>
        <View style={styles.mainVideo}>
          <Text style={styles.videoPlaceholder}>
            Ready to start video session
          </Text>
          {!sessionStarted && (
            <TouchableOpacity
              style={styles.startVideoButton}
              onPress={startVideoCall}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start video call with tutor"
              accessibilityHint="Begins the video learning session"
            >
              <Camera size={24} color="#ffffff" />
              <Text style={styles.startVideoText}>Start Video Call</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.selfVideo}>
          <Text style={styles.selfVideoPlaceholder}>Preview</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Session Progress</Text>
          <Text style={styles.progressPercent}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${progressPercentage}%` }]}
          />
        </View>

        <View style={styles.milestones}>
          {progress.map((milestone) => (
            <TouchableOpacity
              key={milestone.id}
              style={styles.milestoneItem}
              onPress={() => toggleProgress(milestone.id)}
            >
              {milestone.completed ? (
                <CheckSquare size={20} color="#10b981" />
              ) : (
                <Square
                  size={20}
                  color={colorScheme === 'dark' ? '#6b7280' : '#9ca3af'}
                />
              )}
              <Text
                style={[
                  styles.milestoneText,
                  milestone.completed && styles.completedMilestone,
                ]}
              >
                {milestone.milestone}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            !audioEnabled && styles.disabledControl,
          ]}
          onPress={() => setAudioEnabled(!audioEnabled)}
        >
          {audioEnabled ? (
            <Mic size={24} color="#ffffff" />
          ) : (
            <MicOff size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            !videoEnabled && styles.disabledControl,
          ]}
          onPress={() => setVideoEnabled(!videoEnabled)}
        >
          {videoEnabled ? (
            <Video size={24} color="#ffffff" />
          ) : (
            <VideoOff size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleChat}>
          <MessageCircle size={24} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton}>
          <Share size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {chatVisible && (
        <SessionChat
          sessionId={id as string}
          currentUserId="current-user-id" // This would come from auth
          currentUserName="You"
          isVisible={chatVisible}
          onClose={toggleChat}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    sessionInfo: {
      flex: 1,
    },
    tutorName: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    sessionTitle: {
      fontSize: 14,
      color: '#e5e7eb',
    },
    endCallButton: {
      backgroundColor: '#ef4444',
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoContainer: {
      flex: 1,
      position: 'relative',
    },
    mainVideo: {
      flex: 1,
      backgroundColor: '#1f2937',
      justifyContent: 'center',
      alignItems: 'center',
    },
    videoPlaceholder: {
      fontSize: 18,
      color: '#9ca3af',
    },
    selfVideo: {
      position: 'absolute',
      top: 20,
      right: 20,
      width: 120,
      height: 160,
      backgroundColor: '#374151',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selfVideoPlaceholder: {
      fontSize: 12,
      color: '#9ca3af',
    },
    progressSection: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 16,
      margin: 16,
      borderRadius: 12,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#ffffff',
    },
    progressPercent: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#10b981',
    },
    progressBar: {
      height: 6,
      backgroundColor: '#374151',
      borderRadius: 3,
      marginBottom: 16,
    },
    progressFill: {
      height: '100%',
      backgroundColor: '#10b981',
      borderRadius: 3,
    },
    milestones: {
      gap: 12,
    },
    milestoneItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    milestoneText: {
      fontSize: 14,
      color: '#e5e7eb',
      flex: 1,
    },
    completedMilestone: {
      textDecorationLine: 'line-through',
      color: '#9ca3af',
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      gap: 20,
    },
    controlButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: '#374151',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledControl: {
      backgroundColor: '#ef4444',
    },
    startVideoButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#3b82f6',
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 8,
      marginTop: 20,
      gap: 8,
    },
    startVideoText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
    },
  });
