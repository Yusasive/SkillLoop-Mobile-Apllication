import {
  WalletConnectModal,
} from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';
import Environment from './EnvironmentService';

// Define proper WalletConnect types
interface WalletConnectModalConfig {
  projectId: string;
  metadata: {
    name: string;
    description: string;
    url: string;
    icons: string[];
  };
}

export class WalletService {
  private static instance: WalletService;
  private walletConnectModal: any = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private connectedAddress = '';

  private constructor() {
    this.initializeWalletConnect();
  }

  static getInstance(): WalletService {
    if (!WalletService.instance) {
      WalletService.instance = new WalletService();
    }
    return WalletService.instance;
  }

  private initializeWalletConnect() {
    const projectId = Environment.get('WALLETCONNECT_PROJECT_ID');

    const options: WalletConnectModalConfig = {
      projectId,
      metadata: {
        name: 'SkillLoop',
        description: 'Decentralized Peer-to-Peer Learning Platform',
        url: Environment.get('APP_URL') || '',
        icons: [`${Environment.get('APP_URL')}/logo.png`],
      },
    };

    this.walletConnectModal = new WalletConnectModal(options);
  }

  static async connect(): Promise<string> {
    const instance = WalletService.getInstance();

    if (!instance.walletConnectModal) {
      throw new Error('WalletConnect not initialized');
    }

    await instance.walletConnectModal.open();

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error('Connection timeout')),
        60000,
      );

      instance.walletConnectModal!.on('connect', (session: ConnectEvent) => {
        clearTimeout(timeout);
        const address = session.accounts[0];
        instance.connectedAddress = address;
        resolve(address);
      });
    instance.walletConnectModal!.on('connect', (session: any) => {
      instance.walletConnectModal!.on('reject', () => {
      const address = session.accounts?.[0] || '';
        reject(new Error('Connection rejected'));
      });
    });
  }

  static async disconnect(): Promise<void> {
    const instance = WalletService.getInstance();

    try {
      if (instance.walletConnectModal) {
        await instance.walletConnectModal.disconnect();
      }
      instance.connectedAddress = '';
      instance.provider = null;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }

  static getConnectedAddress(): string {
    return WalletService.getInstance().connectedAddress;
  }

  static getConnectedWallets(): string[] {
    return WalletService.getInstance().connectedAddress
      ? [WalletService.getInstance().connectedAddress]
      : [];
  }

  static async getProvider(): Promise<ethers.providers.Web3Provider> {
    const instance = WalletService.getInstance();

    if (!instance.provider && instance.walletConnectModal) {
      instance.provider = new ethers.providers.Web3Provider(
        instance.walletConnectModal as unknown as ethers.providers.ExternalProvider,
      );
    }

    if (!instance.provider) {
      throw new Error('No wallet provider available');
    }

    return instance.provider;
  }

  static async signMessage(message: string): Promise<string> {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();
      return await signer.signMessage(message);
    } catch {
      throw new Error('Failed to sign message');
    }
  }
}
