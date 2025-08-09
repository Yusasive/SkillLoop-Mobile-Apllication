# Environment Variables Setup Guide

This guide explains how to set up environment variables for the SkillLoop mobile application.

## Overview

The SkillLoop mobile app uses environment variables to configure:

- Blockchain network settings (RPC URLs, contract addresses)
- API endpoints
- WalletConnect configuration
- Optional analytics and monitoring services

## Required Environment Variables

### Blockchain Configuration

- `EXPO_PUBLIC_RPC_URL`: Ethereum RPC endpoint (e.g., Infura or Alchemy)
- `EXPO_PUBLIC_ESCROW_CONTRACT_ADDRESS`: Smart contract address for escrow functionality
- `EXPO_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS`: Smart contract address for NFT certificates
- `EXPO_PUBLIC_SKL_CONTRACT_ADDRESS`: SkillLoop token contract address

### WalletConnect Configuration

- `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID`: Your WalletConnect project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/)

### API Configuration

- `EXPO_PUBLIC_API_URL`: Backend API base URL
- `EXPO_PUBLIC_APP_URL`: Frontend application URL

## Setup Instructions

### 1. Copy Environment Template

```bash
cp .env.example .env
```

### 2. Get Required Credentials

#### WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID

#### Infura RPC URL

1. Go to [Infura](https://infura.io/)
2. Create a new project
3. Copy the endpoint URL for your desired network

#### Contract Addresses

Deploy or get the addresses for:

- Escrow contract
- Certificate NFT contract
- SKL token contract

### 3. Update .env File

Open `.env` and replace placeholder values with your actual credentials:

```env
# Blockchain Configuration
EXPO_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
EXPO_PUBLIC_ESCROW_CONTRACT_ADDRESS=0xYourEscrowContractAddress
EXPO_PUBLIC_CERTIFICATE_CONTRACT_ADDRESS=0xYourCertificateContractAddress
EXPO_PUBLIC_SKL_CONTRACT_ADDRESS=0xYourSKLTokenAddress

# WalletConnect Configuration
EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# API Configuration
EXPO_PUBLIC_API_URL=https://api.skillloop.app
EXPO_PUBLIC_APP_URL=https://skillloop.app
```

## Environment-Specific Configuration

### Development

Use `.env.development` for local development with test networks and local API endpoints.

### Production

Use `.env.production` for production builds with mainnet contracts and production API endpoints.

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit sensitive data**: The `.env` files are in `.gitignore` to prevent accidental commits
2. **Use test networks for development**: Always use testnets (Sepolia, Goerli) for development
3. **Rotate credentials regularly**: Update API keys and project IDs periodically
4. **Use different credentials per environment**: Development and production should have separate credentials

## Validation

The app includes automatic environment validation that will:

- Check for required environment variables on startup
- Display warnings in development if variables are missing
- Prevent runtime errors from missing configuration

## Troubleshooting

### Common Issues

1. **"WalletConnect not initialized" error**

   - Check that `EXPO_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly

2. **"Contract address required" error**

   - Ensure all contract addresses are set and valid

3. **API connection errors**
   - Verify `EXPO_PUBLIC_API_URL` is correct and accessible

### Debug Environment

To check current environment configuration:

```typescript
import Environment from '@/services/EnvironmentService';

console.log('Current environment:', Environment.getAll());
console.log('Validation result:', Environment.validateConfig());
```

## Additional Resources

- [Expo Environment Variables Documentation](https://docs.expo.dev/guides/environment-variables/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Infura Documentation](https://docs.infura.io/)
