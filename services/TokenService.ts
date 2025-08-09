import { ethers } from 'ethers';
import { WalletService } from './WalletService';
import { ApiService } from './ApiService';
import Environment from './EnvironmentService';

export class TokenService {
  private static get SKL_CONTRACT_ADDRESS() {
    return Environment.get('SKL_CONTRACT_ADDRESS');
  }

  private static get ESCROW_CONTRACT_ADDRESS() {
    return Environment.get('ESCROW_CONTRACT_ADDRESS');
  }

  static async getBalance() {
    try {
      const provider = await WalletService.getProvider();
      const address = WalletService.getConnectedAddress();

      // Get ETH balance
      const ethBalance = await provider.getBalance(address);

      // Get SKL token balance
      const sklContract = new ethers.Contract(
        this.SKL_CONTRACT_ADDRESS,
        ['function balanceOf(address) view returns (uint256)'],
        provider,
      );
      const sklBalance = await sklContract.balanceOf(address);

      return {
        eth: ethers.utils.formatEther(ethBalance),
        skl: ethers.utils.formatEther(sklBalance),
      };
    } catch (error) {
      throw new Error('Failed to get token balance');
    }
  }

  static async transfer(to: string, amount: string) {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();

      const sklContract = new ethers.Contract(
        this.SKL_CONTRACT_ADDRESS,
        [
          'function transfer(address to, uint256 amount) returns (bool)',
          'function decimals() view returns (uint8)',
        ],
        signer,
      );

      const decimals = await sklContract.decimals();
      const transferAmount = ethers.utils.parseUnits(amount, decimals);

      const tx = await sklContract.transfer(to, transferAmount);

      // Create transaction record
      type TransactionStatus = 'pending' | 'confirmed';

      const transaction: {
        id: string;
        type: 'sent';
        amount: string;
        token: string;
        from: string;
        to: string;
        status: TransactionStatus;
        timestamp: string;
        txHash: string;
      } = {
        id: tx.hash,
        type: 'sent',
        amount,
        token: 'SKL',
        from: WalletService.getConnectedAddress(),
        to,
        status: 'pending',
        timestamp: new Date().toISOString(),
        txHash: tx.hash,
      };

      // Wait for confirmation
      await tx.wait();
      transaction.status = 'confirmed';

      return transaction;
    } catch (error) {
      throw new Error('Failed to transfer tokens');
    }
  }

  static async lockInEscrow(sessionId: string, amount: string) {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();

      const escrowContract = new ethers.Contract(
        this.ESCROW_CONTRACT_ADDRESS,
        ['function lockTokens(string sessionId, uint256 amount)'],
        signer,
      );

      const sklContract = new ethers.Contract(
        this.SKL_CONTRACT_ADDRESS,
        [
          'function approve(address spender, uint256 amount) returns (bool)',
          'function decimals() view returns (uint8)',
        ],
        signer,
      );

      const decimals = await sklContract.decimals();
      const lockAmount = ethers.utils.parseUnits(amount, decimals);

      // First approve the escrow contract
      const approveTx = await sklContract.approve(
        this.ESCROW_CONTRACT_ADDRESS,
        lockAmount,
      );
      await approveTx.wait();

      // Then lock the tokens
      const lockTx = await escrowContract.lockTokens(sessionId, lockAmount);

      type TransactionStatus = 'pending' | 'confirmed';

      interface EscrowTransaction {
        id: string;
        type: 'escrow_lock';
        amount: string;
        token: string;
        from: string;
        to: string;
        status: TransactionStatus;
        timestamp: string;
        txHash: string;
        sessionId: string;
      }

      const transaction: EscrowTransaction = {
        id: lockTx.hash,
        type: 'escrow_lock',
        amount,
        token: 'SKL',
        from: WalletService.getConnectedAddress(),
        to: this.ESCROW_CONTRACT_ADDRESS,
        status: 'pending',
        timestamp: new Date().toISOString(),
        txHash: lockTx.hash,
        sessionId,
      };

      await lockTx.wait();
      transaction.status = 'confirmed';

      return transaction;
    } catch (error) {
      throw new Error('Failed to lock tokens in escrow');
    }
  }

  static async releaseFromEscrow(sessionId: string) {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();

      const escrowContract = new ethers.Contract(
        this.ESCROW_CONTRACT_ADDRESS,
        ['function releaseTokens(string sessionId)'],
        signer,
      );

      const releaseTx = await escrowContract.releaseTokens(sessionId);

      type TransactionStatus = 'pending' | 'confirmed';

      interface EscrowReleaseTransaction {
        id: string;
        type: 'escrow_release';
        amount: string;
        token: string;
        from: string;
        to: string;
        status: TransactionStatus;
        timestamp: string;
        txHash: string;
        sessionId: string;
      }

      const transaction: EscrowReleaseTransaction = {
        id: releaseTx.hash,
        type: 'escrow_release',
        amount: '0',
        token: 'SKL',
        from: this.ESCROW_CONTRACT_ADDRESS,
        to: WalletService.getConnectedAddress(),
        status: 'pending',
        timestamp: new Date().toISOString(),
        txHash: releaseTx.hash,
        sessionId,
      };

      await releaseTx.wait();
      transaction.status = 'confirmed'; 

      return transaction;
    } catch (error) {
      throw new Error('Failed to release tokens from escrow');
    }
  }

  static async getTransactionHistory() {
    try {
      // Get transaction history from API
      const response = await ApiService.get('/transactions');
      return response.transactions || [];
    } catch (error) {
      throw new Error('Failed to get transaction history');
    }
  }
}
