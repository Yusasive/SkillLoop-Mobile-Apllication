import { WalletConnectModal } from '@walletconnect/modal-react-native';
import { ethers } from 'ethers';

export class WalletService {
  private static instance: WalletService;
  private walletConnectModal: WalletConnectModal | null = null;
  private provider: ethers.providers.Web3Provider | null = null;
  private connectedAddress: string = '';

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
    const projectId = process.env.EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID || '';
    
    this.walletConnectModal = new WalletConnectModal({
      projectId,
      metadata: {
        name: 'SkillLoop',
        description: 'Decentralized Peer-to-Peer Learning Platform',
        url: 'https://skillloop.app',
        icons: ['https://skillloop.app/logo.png'],
      },
    });
  }

  static async connect(): Promise<string> {
    const instance = WalletService.getInstance();
    
    try {
      if (!instance.walletConnectModal) {
        throw new Error('WalletConnect not initialized');
      }

      await instance.walletConnectModal.open();
      
      // Wait for connection
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timeout'));
        }, 60000);

        instance.walletConnectModal!.on('connect', (session) => {
          clearTimeout(timeout);
          const address = session.accounts[0];
          instance.connectedAddress = address;
          resolve(address);
        });

        instance.walletConnectModal!.on('reject', () => {
          clearTimeout(timeout);
          reject(new Error('Connection rejected'));
        });
      });
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
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
    // Return list of connected wallet addresses
    return WalletService.getInstance().connectedAddress ? 
      [WalletService.getInstance().connectedAddress] : [];
  }

  static async getProvider(): Promise<ethers.providers.Web3Provider> {
    const instance = WalletService.getInstance();
    
    if (!instance.provider && instance.walletConnectModal) {
      // Create provider from WalletConnect
      instance.provider = new ethers.providers.Web3Provider(
        instance.walletConnectModal as any
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
    } catch (error) {
      throw new Error('Failed to sign message');
    }
  }
}