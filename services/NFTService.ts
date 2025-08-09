import { ethers } from 'ethers';
import { WalletService } from './WalletService';
import Environment from './EnvironmentService';

export class NFTService {
  private static get CERTIFICATE_CONTRACT_ADDRESS() {
    return Environment.get('CERTIFICATE_CONTRACT_ADDRESS');
  }

  static async mintCertificate(certificateData: any) {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();

      const certificateContract = new ethers.Contract(
        this.CERTIFICATE_CONTRACT_ADDRESS,
        [
          'function mintCertificate(address to, string memory tokenURI) returns (uint256)',
        ],
        signer,
      );

      // Upload metadata to IPFS (in production, you'd use a proper IPFS service)
      const metadataURI = await this.uploadMetadataToIPFS(
        certificateData.metadata,
      );

      const userAddress = WalletService.getConnectedAddress();
      const mintTx = await certificateContract.mintCertificate(
        userAddress,
        metadataURI,
      );

      const receipt = await mintTx.wait();

      // Extract token ID from events
      const mintEvent = receipt.events?.find(
        (event: any) => event.event === 'Transfer',
      );

      const tokenId = mintEvent?.args?.tokenId?.toString() || '';

      return {
        tokenId,
        contractAddress: this.CERTIFICATE_CONTRACT_ADDRESS,
        txHash: mintTx.hash,
        mintedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error('Failed to mint certificate NFT');
    }
  }

  private static async uploadMetadataToIPFS(metadata: any): Promise<string> {
    // In a production app, you would use a proper IPFS service like Pinata or IPFS.io
    // For now, we'll return a placeholder URI
    const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 48)}`;
    return `ipfs://${mockIPFSHash}`;
  }

  static async getCertificateMetadata(tokenURI: string) {
    try {
      // Fetch metadata from IPFS
      const response = await fetch(
        tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'),
      );
      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch certificate metadata');
    }
  }

  static async transferCertificate(tokenId: string, to: string) {
    try {
      const provider = await WalletService.getProvider();
      const signer = provider.getSigner();

      const certificateContract = new ethers.Contract(
        this.CERTIFICATE_CONTRACT_ADDRESS,
        [
          'function safeTransferFrom(address from, address to, uint256 tokenId)',
        ],
        signer,
      );

      const userAddress = WalletService.getConnectedAddress();
      const transferTx = await certificateContract.safeTransferFrom(
        userAddress,
        to,
        tokenId,
      );

      await transferTx.wait();
      return transferTx.hash;
    } catch (error) {
      throw new Error('Failed to transfer certificate');
    }
  }
}
