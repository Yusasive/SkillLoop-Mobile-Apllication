import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalyticsService } from './AnalyticsService';

const analyticsService = AnalyticsService.getInstance();

export interface QueuedAction {
  id: string;
  type: string;
  payload: any;
  timestamp: number;
  retryCount: number;
  maxRetries: number;
  priority: 'low' | 'medium' | 'high';
}

export interface OfflineQueueConfig {
  maxQueueSize: number;
  retryDelay: number;
  maxRetries: number;
  storageKey: string;
}

class OfflineQueueService {
  private static instance: OfflineQueueService;
  private queue: QueuedAction[] = [];
  private isOnline = true;
  private isProcessing = false;
  private config: OfflineQueueConfig;

  private constructor() {
    this.config = {
      maxQueueSize: 100,
      retryDelay: 1000,
      maxRetries: 3,
      storageKey: 'offline_queue',
    };

    this.initializeOfflineQueue();
    this.setupNetworkListener();
  }

  static getInstance(): OfflineQueueService {
    if (!OfflineQueueService.instance) {
      OfflineQueueService.instance = new OfflineQueueService();
    }
    return OfflineQueueService.instance;
  }

  private async initializeOfflineQueue() {
    try {
      // Load persisted queue from storage
      const persistedQueue = await AsyncStorage.getItem(this.config.storageKey);
      if (persistedQueue) {
        this.queue = JSON.parse(persistedQueue);
        console.log(`Loaded ${this.queue.length} items from offline queue`);
      }

      // Check initial network state
      const netInfo = await NetInfo.fetch();
      this.isOnline = netInfo.isConnected ?? false;

      if (this.isOnline && this.queue.length > 0) {
        this.processQueue();
      }
    } catch (error) {
      console.error('Failed to initialize offline queue:', error);
    }
  }

  private setupNetworkListener() {
    NetInfo.addEventListener((state) => {
      const wasOffline = !this.isOnline;
      this.isOnline = state.isConnected ?? false;

      analyticsService.track('network_state_changed', {
        is_online: this.isOnline,
        connection_type: state.type,
        timestamp: new Date().toISOString(),
      });

      // If we just came back online and have queued items, process them
      if (wasOffline && this.isOnline && this.queue.length > 0) {
        console.log('Network restored, processing offline queue');
        this.processQueue();
      }
    });
  }

  async addToQueue(
    action: Omit<QueuedAction, 'id' | 'timestamp' | 'retryCount'>,
  ): Promise<void> {
    const queuedAction: QueuedAction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      ...action,
      maxRetries: action.maxRetries ?? this.config.maxRetries, // set last
    };
      

    // If online, try to execute immediately
    if (this.isOnline) {
      try {
        await this.executeAction(queuedAction);
        return;
      } catch (error) {
        console.log('Failed to execute action online, adding to queue');
      }
    }

    // Add to queue
    this.queue.push(queuedAction);

    // Sort by priority (high -> medium -> low) and timestamp
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      return priorityDiff !== 0 ? priorityDiff : a.timestamp - b.timestamp;
    });

    // Trim queue if it exceeds max size
    if (this.queue.length > this.config.maxQueueSize) {
      this.queue = this.queue.slice(0, this.config.maxQueueSize);
    }

    await this.persistQueue();

    analyticsService.track('action_queued_offline', {
      action_type: queuedAction.type,
      queue_size: this.queue.length,
      priority: queuedAction.priority,
      timestamp: new Date().toISOString(),
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || !this.isOnline || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    console.log(`Processing offline queue with ${this.queue.length} items`);

    const processedItems: string[] = [];
    const failedItems: QueuedAction[] = [];

    for (const action of [...this.queue]) {
      try {
        await this.executeAction(action);
        processedItems.push(action.id);
      } catch (error) {
        console.error(`Failed to execute queued action ${action.id}:`, error);

        action.retryCount++;
        if (action.retryCount < action.maxRetries) {
          failedItems.push(action);
        } else {
          console.log(
            `Max retries exceeded for action ${action.id}, dropping from queue`,
          );
          analyticsService.track('offline_action_failed', {
            action_type: action.type,
            retry_count: action.retryCount,
            timestamp: new Date().toISOString(),
          });
        }
      }

      // Add delay between processing items to avoid overwhelming the server
      if (this.queue.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }

    // Update queue with only failed items that haven't exceeded max retries
    this.queue = failedItems;
    await this.persistQueue();

    this.isProcessing = false;

    analyticsService.track('offline_queue_processed', {
      processed_count: processedItems.length,
      failed_count: failedItems.length,
      remaining_count: this.queue.length,
      timestamp: new Date().toISOString(),
    });

    // If there are still failed items, schedule retry
    if (failedItems.length > 0) {
      setTimeout(() => {
        if (this.isOnline) {
          this.processQueue();
        }
      }, this.config.retryDelay);
    }
  }

  private async executeAction(action: QueuedAction): Promise<void> {
    // This would be implemented based on your specific action types
    switch (action.type) {
      case 'BOOK_SESSION':
        // await this.executeBookSession(action.payload);
        console.log('Executing book session:', action.payload);
        break;
      case 'SEND_MESSAGE':
        // await this.executeSendMessage(action.payload);
        console.log('Executing send message:', action.payload);
        break;
      case 'UPDATE_PROFILE':
        // await this.executeUpdateProfile(action.payload);
        console.log('Executing update profile:', action.payload);
        break;
      case 'SUBMIT_REVIEW':
        // await this.executeSubmitReview(action.payload);
        console.log('Executing submit review:', action.payload);
        break;
      case 'FAVORITE_TUTOR':
        // await this.executeFavoriteTutor(action.payload);
        console.log('Executing favorite tutor:', action.payload);
        break;
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  private async persistQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(
        this.config.storageKey,
        JSON.stringify(this.queue),
      );
    } catch (error) {
      console.error('Failed to persist offline queue:', error);
    }
  }

  // Public methods for managing the queue
  getQueueStatus() {
    return {
      isOnline: this.isOnline,
      queueSize: this.queue.length,
      isProcessing: this.isProcessing,
      pendingActions: this.queue.map((action) => ({
        id: action.id,
        type: action.type,
        priority: action.priority,
        retryCount: action.retryCount,
        timestamp: action.timestamp,
      })),
    };
  }

  async clearQueue(): Promise<void> {
    this.queue = [];
    await this.persistQueue();
    console.log('Offline queue cleared');
  }

  async removeFromQueue(actionId: string): Promise<void> {
    this.queue = this.queue.filter((action) => action.id !== actionId);
    await this.persistQueue();
  }

  // Convenience methods for common actions
  async queueBookSession(sessionData: any): Promise<void> {
    await this.addToQueue({
      type: 'BOOK_SESSION',
      payload: sessionData,
      priority: 'high',
      maxRetries: 5,
    });
  }

  async queueSendMessage(messageData: any): Promise<void> {
    await this.addToQueue({
      type: 'SEND_MESSAGE',
      payload: messageData,
      priority: 'medium',
      maxRetries: 3,
    });
  }

  async queueUpdateProfile(profileData: any): Promise<void> {
    await this.addToQueue({
      type: 'UPDATE_PROFILE',
      payload: profileData,
      priority: 'medium',
      maxRetries: 3,
    });
  }

  async queueSubmitReview(reviewData: any): Promise<void> {
    await this.addToQueue({
      type: 'SUBMIT_REVIEW',
      payload: reviewData,
      priority: 'low',
      maxRetries: 2,
    });
  }

  async queueFavoriteTutor(tutorData: any): Promise<void> {
    await this.addToQueue({
      type: 'FAVORITE_TUTOR',
      payload: tutorData,
      priority: 'low',
      maxRetries: 2,
    });
  }
}

export default OfflineQueueService.getInstance();
