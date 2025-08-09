import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  RotateCw,
  Volume2,
  VolumeX,
} from 'lucide-react-native';

interface VideoCallViewProps {
  tutorId: string;
  sessionId: string;
  onEndCall: () => void;
  isInitiator?: boolean;
}

interface VideoCallState {
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isSpeakerEnabled: boolean;
  isConnected: boolean;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'unknown';
  participants: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function VideoCallView({
  tutorId,
  sessionId,
  onEndCall,
  isInitiator = false,
}: VideoCallViewProps) {
  const [callState, setCallState] = useState<VideoCallState>({
    isVideoEnabled: true,
    isAudioEnabled: true,
    isSpeakerEnabled: true,
    isConnected: false,
    connectionQuality: 'unknown',
    participants: 1,
  });

  const [isConnecting, setIsConnecting] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const callStartTime = useRef<Date | null>(null);

  useEffect(() => {
    // Initialize video call
    initializeVideoCall();

    // Start call timer
    callStartTime.current = new Date();
    const timer = setInterval(() => {
      if (callStartTime.current) {
        const duration = Math.floor(
          (Date.now() - callStartTime.current.getTime()) / 1000,
        );
        setCallDuration(duration);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      // Cleanup video call
      cleanupVideoCall();
    };
  }, []);

  const initializeVideoCall = async () => {
    try {
      // This would integrate with VideoCallService
      // const { VideoCallService } = await import('../../services/VideoCallService');

      setIsConnecting(true);

      // Simulate connection delay
      setTimeout(() => {
        setCallState((prev) => ({
          ...prev,
          isConnected: true,
          connectionQuality: 'good',
        }));
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize video call:', error);
      Alert.alert('Connection Error', 'Failed to establish video call');
      setIsConnecting(false);
    }
  };

  const cleanupVideoCall = () => {
    // Clean up video call resources
    console.log('Cleaning up video call resources');
  };

  const toggleVideo = () => {
    setCallState((prev) => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
    // Call VideoCallService.toggleVideo()
  };

  const toggleAudio = () => {
    setCallState((prev) => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
    // Call VideoCallService.toggleAudio()
  };

  const toggleSpeaker = () => {
    setCallState((prev) => ({
      ...prev,
      isSpeakerEnabled: !prev.isSpeakerEnabled,
    }));
    // Call VideoCallService.toggleSpeaker()
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Session',
      'Are you sure you want to end this learning session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => {
            cleanupVideoCall();
            onEndCall();
          },
        },
      ],
    );
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityColor = () => {
    switch (callState.connectionQuality) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#f59e0b';
      case 'poor':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  if (isConnecting) {
    return (
      <View style={styles.connectingContainer}>
        <Text style={styles.connectingText}>Connecting...</Text>
        <Text style={styles.connectingSubtext}>
          {isInitiator ? 'Waiting for tutor to join' : 'Joining session'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.connectionIndicator,
              { backgroundColor: getConnectionQualityColor() },
            ]}
          />
          <Text style={styles.participantCount}>
            {callState.participants} participant
            {callState.participants > 1 ? 's' : ''}
          </Text>
        </View>
        <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
      </View>

      {/* Main Video Area */}
      <View style={styles.videoContainer}>
        {/* Remote Video */}
        <View style={styles.remoteVideo}>
          {callState.isConnected ? (
            <Text style={styles.videoPlaceholder}>Tutor Video Feed</Text>
          ) : (
            <Text style={styles.videoPlaceholder}>Connecting...</Text>
          )}
        </View>

        {/* Local Video */}
        <View style={styles.localVideo}>
          {callState.isVideoEnabled ? (
            <Text style={styles.localVideoPlaceholder}>You</Text>
          ) : (
            <View style={styles.videoOffContainer}>
              <VideoOff size={24} color="#ffffff" />
            </View>
          )}
        </View>

        {/* Switch Camera Button */}
        <TouchableOpacity style={styles.switchCameraButton}>
          <RotateCw size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        <TouchableOpacity
          style={[
            styles.controlButton,
            !callState.isAudioEnabled && styles.disabledControl,
          ]}
          onPress={toggleAudio}
        >
          {callState.isAudioEnabled ? (
            <Mic size={24} color="#ffffff" />
          ) : (
            <MicOff size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            !callState.isVideoEnabled && styles.disabledControl,
          ]}
          onPress={toggleVideo}
        >
          {callState.isVideoEnabled ? (
            <Video size={24} color="#ffffff" />
          ) : (
            <VideoOff size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.controlButton,
            !callState.isSpeakerEnabled && styles.disabledControl,
          ]}
          onPress={toggleSpeaker}
        >
          {callState.isSpeakerEnabled ? (
            <Volume2 size={24} color="#ffffff" />
          ) : (
            <VolumeX size={24} color="#ffffff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
          <Phone size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  connectingContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectingText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  connectingSubtext: {
    fontSize: 16,
    color: '#9ca3af',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  participantCount: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  duration: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  remoteVideo: {
    flex: 1,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 18,
    color: '#9ca3af',
  },
  localVideo: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 120,
    height: 160,
    backgroundColor: '#374151',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  localVideoPlaceholder: {
    fontSize: 12,
    color: '#9ca3af',
  },
  videoOffContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchCameraButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlPanel: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
