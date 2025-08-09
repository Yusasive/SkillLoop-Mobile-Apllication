import {
  createAgoraRtcEngine,
  RtcEngineContext,
  ChannelProfileType,
  ClientRoleType,
  IRtcEngine,
  IRtcEngineEventHandler,
  ConnectionStateType,
} from 'react-native-agora';
import Environment from './EnvironmentService';
import { HapticService } from './HapticService';

export interface VideoCallConfig {
  sessionId: string;
  userId: string;
  userName: string;
  isTutor: boolean;
}

export interface VideoCallState {
  isConnected: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isSpeakerEnabled: boolean;
  participants: VideoParticipant[];
  connectionState: ConnectionStateType;
}

export interface VideoParticipant {
  uid: number;
  name: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isTutor: boolean;
}

export class VideoCallService {
  private static instance: VideoCallService;
  private engine: IRtcEngine | null = null;
  private isInitialized = false;
  private currentChannel: string | null = null;
  private stateCallback: ((state: VideoCallState) => void) | null = null;

  private constructor() {}

  static getInstance(): VideoCallService {
    if (!VideoCallService.instance) {
      VideoCallService.instance = new VideoCallService();
    }
    return VideoCallService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    const appId = Environment.get('AGORA_APP_ID');
    if (!appId) {
      console.warn('Agora App ID not configured, using mock implementation');
      this.isInitialized = true;
      return;
    }

    const context: RtcEngineContext = {
      appId,
      channelProfile: ChannelProfileType.ChannelProfileCommunication,
    };

    this.engine = createAgoraRtcEngine();
    this.engine.initialize(context);
    this.setupEventHandlers();

    this.engine.enableVideo();
    this.engine.enableAudio();

    this.isInitialized = true;
    console.log('Agora Video Service initialized successfully');
  }

  private setupEventHandlers(): void {
    if (!this.engine) return;

    const handler: Partial<IRtcEngineEventHandler> = {
      onJoinChannelSuccess: (_conn, _elapsed) => {
        HapticService.success();
        this.updateState({ isConnected: true });
      },
      onUserJoined: (_conn, remoteUid, _elapsed) => {
        console.log('User joined:', remoteUid);
        this.updateState({});
      },
      onUserOffline: (_conn, remoteUid, _reason) => {
        console.log('User offline:', remoteUid);
        this.updateState({});
      },
      onConnectionStateChanged: (_conn, state, _reason) => {
        this.updateState({ connectionState: state });
      },
      onError: (_err, _msg) => {
        HapticService.error();
      },
    };

    Object.entries(handler).forEach(([event, cb]) => {
      if (cb && this.engine) {
        this.engine.addListener(event as any, cb);
      }
    });
  }

  async joinCall(config: VideoCallConfig, token?: string): Promise<void> {
    if (!this.engine || !this.isInitialized) await this.initialize();

    if (!this.engine) {
      console.warn('Video call engine not available, using mock implementation');
      this.currentChannel = `session_${config.sessionId}`;
      this.updateState({ isConnected: true });
      return;
    }

    const channelName = `session_${config.sessionId}`;
    const uid = parseInt(config.userId, 10) || 0;
    const role = config.isTutor
      ? ClientRoleType.ClientRoleBroadcaster
      : ClientRoleType.ClientRoleAudience;

    await this.engine?.setClientRole(role);
    await this.engine?.joinChannel(token || '', channelName, uid, {
      autoSubscribeAudio: true,
      autoSubscribeVideo: true,
    });

    this.currentChannel = channelName;
    console.log(`Joined video call: ${channelName}`);
  }

  async leaveCall(): Promise<void> {
    if (this.engine && this.currentChannel) {
      await this.engine.leaveChannel();
      this.currentChannel = null;
      this.updateState({
        isConnected: false,
        participants: [],
      });
      console.log('Left video call');
    }
  }

  async toggleVideo(): Promise<boolean> {
    // Implement internal state tracking as needed
    if (this.engine) {
      await this.engine.enableLocalVideo(true);
    }
    HapticService.light();
    return true;
  }

  async toggleAudio(): Promise<boolean> {
    if (this.engine) {
      await this.engine.enableLocalAudio(true);
    }
    HapticService.light();
    return true;
  }

  async switchCamera(): Promise<void> {
    if (this.engine) {
      await this.engine.switchCamera();
    }
    HapticService.light();
  }

  async toggleSpeaker(): Promise<boolean> {
    if (this.engine) {
      await this.engine.setEnableSpeakerphone(true);
    }
    HapticService.light();
    return true;
  }

  async startScreenShare(): Promise<void> {
    if (this.engine) {
      await this.engine.startScreenCapture({
        captureVideo: true,
        captureAudio: true,
        videoParams: {
          dimensions: { width: 1280, height: 720 },
          frameRate: 15,
          bitrate: 1000,
        },
      });
    }
    console.log('Screen sharing started');
  }

  async stopScreenShare(): Promise<void> {
    if (this.engine) {
      await this.engine.stopScreenCapture();
    }
    console.log('Stopped screen sharing');
  }

  setStateCallback(callback: (state: VideoCallState) => void): void {
    this.stateCallback = callback;
  }

  private updateState(updates: Partial<VideoCallState>): void {
    if (!this.stateCallback) return;
    const base: VideoCallState = {
      isConnected: false,
      isVideoEnabled: true,
      isAudioEnabled: true,
      isSpeakerEnabled: false,
      participants: [],
      connectionState: ConnectionStateType.ConnectionStateDisconnected,
      ...updates,
    };
    this.stateCallback(base);
  }

  async cleanup(): Promise<void> {
    if (this.currentChannel) await this.leaveCall();
    await this.engine?.release();
    this.engine = null;
    this.isInitialized = false;
    this.stateCallback = null;
  }

  getEngine(): IRtcEngine | null {
    return this.engine;
  }
}
