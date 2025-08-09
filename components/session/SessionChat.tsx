import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { Send, X } from 'lucide-react-native';

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface SessionChatProps {
  sessionId: string;
  currentUserId: string;
  currentUserName: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function SessionChat({
  sessionId,
  currentUserId,
  currentUserName,
  isVisible,
  onClose,
}: SessionChatProps) {
  const colorScheme = useColorScheme();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: 'system',
      senderName: 'System',
      message:
        'Session started. You can use this chat for questions and notes.',
      timestamp: new Date(),
      type: 'system',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const styles = createStyles(colorScheme === 'dark');

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (inputText.trim().length === 0) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      message: inputText.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Here you would send the message through your real-time service
    // await ChatService.sendMessage(sessionId, newMessage);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isOwnMessage = (senderId: string) => senderId === currentUserId;

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Session Chat</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={styles.headerTitle.color} />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === 'system' && styles.systemMessageContainer,
              isOwnMessage(message.senderId) && styles.ownMessageContainer,
            ]}
          >
            {message.type === 'system' ? (
              <Text style={styles.systemMessage}>{message.message}</Text>
            ) : (
              <>
                <View
                  style={[
                    styles.messageBubble,
                    isOwnMessage(message.senderId) && styles.ownMessageBubble,
                  ]}
                >
                  {!isOwnMessage(message.senderId) && (
                    <Text style={styles.senderName}>{message.senderName}</Text>
                  )}
                  <Text
                    style={[
                      styles.messageText,
                      isOwnMessage(message.senderId) && styles.ownMessageText,
                    ]}
                  >
                    {message.message}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.timestamp,
                    isOwnMessage(message.senderId) && styles.ownTimestamp,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={styles.placeholder.color}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
            blurOnSubmit={false}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length === 0 && styles.sendButtonDisabled,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim().length === 0}
          >
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: isDark ? '#111827' : '#ffffff',
      zIndex: 1000,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#374151' : '#e5e7eb',
      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? '#ffffff' : '#111827',
    },
    closeButton: {
      padding: 8,
    },
    messagesContainer: {
      flex: 1,
    },
    messagesContent: {
      padding: 16,
      paddingBottom: 8,
    },
    messageContainer: {
      marginBottom: 16,
    },
    systemMessageContainer: {
      alignItems: 'center',
    },
    ownMessageContainer: {
      alignItems: 'flex-end',
    },
    systemMessage: {
      fontSize: 12,
      color: isDark ? '#9ca3af' : '#6b7280',
      fontStyle: 'italic',
      textAlign: 'center',
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    messageBubble: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      maxWidth: '80%',
    },
    ownMessageBubble: {
      backgroundColor: '#3b82f6',
    },
    senderName: {
      fontSize: 12,
      fontWeight: '600',
      color: isDark ? '#9ca3af' : '#6b7280',
      marginBottom: 4,
    },
    messageText: {
      fontSize: 16,
      color: isDark ? '#ffffff' : '#111827',
      lineHeight: 20,
    },
    ownMessageText: {
      color: '#ffffff',
    },
    timestamp: {
      fontSize: 12,
      color: isDark ? '#6b7280' : '#9ca3af',
      marginTop: 4,
    },
    ownTimestamp: {
      textAlign: 'right',
    },
    inputContainer: {
      borderTopWidth: 1,
      borderTopColor: isDark ? '#374151' : '#e5e7eb',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    textInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#d1d5db',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      fontSize: 16,
      color: isDark ? '#ffffff' : '#111827',
      backgroundColor: isDark ? '#374151' : '#f9fafb',
      maxHeight: 100,
    },
    placeholder: {
      color: isDark ? '#6b7280' : '#9ca3af',
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#3b82f6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonDisabled: {
      backgroundColor: isDark ? '#4b5563' : '#9ca3af',
    },
  });
