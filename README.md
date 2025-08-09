# SkillLoop Mobile App

A decentralized peer-to-peer learning platform built with React Native and Expo.

##  Features

- **Video Calls**: Real-time communication with Agora.io integration
- **Push Notifications**: Comprehensive notification system
- **Offline Support**: Enhanced offline functionality with queuing
- **Analytics**: Integrated Sentry and Segment for tracking and error reporting
- **Accessibility**: WCAG 2.1 AA compliant interface
- **Performance Monitoring**: Real-time performance tracking
- **Web3 Integration**: Blockchain-based certificates and payments

## 🛠️ Tech Stack

- **Framework**: React Native with Expo Router
- **State Management**: Redux Toolkit with Redux Persist
- **Styling**: React Native StyleSheet with dark mode support
- **Video**: Agora.io for video calls
- **Analytics**: Sentry (error tracking) + Segment (user analytics)
- **Notifications**: Expo Notifications
- **Web3**: Ethers.js + WalletConnect
- **UI Components**: Lucide React Native icons

##  Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
4. Fill in your API keys and configuration in `.env`
5. Start the development server:
   ```bash
   npm run dev
   ```

##  Project Structure

```
app/                    # App Router screens
├── (tabs)/            # Tab-based navigation
├── auth/              # Authentication screens
├── onboarding/        # Onboarding flow
├── session/           # Session management
└── tutor/             # Tutor profiles

components/            # Reusable components
├── certificates/      # NFT certificate components
├── common/           # Shared components
├── discover/         # Discovery and search
├── home/            # Dashboard components
├── profile/         # User profile components
├── sessions/        # Session-related components
└── session/         # Video call components

services/            # Business logic services
├── AnalyticsService.ts
├── PushNotificationService.ts
├── VideoCallService.ts
├── EnvironmentService.ts
└── ...

store/              # Redux store
├── slices/         # Redux slices
└── api/           # RTK Query API

hooks/             # Custom React hooks
docs/              # Documentation
```

##  Configuration

See `docs/ENVIRONMENT_SETUP.md` for detailed environment configuration.

##  Testing

```bash
npm run lint          # Run ESLint
npm run build:web     # Build for web
```

##  Development

The app supports multiple platforms:

- iOS (via Expo)
- Android (via Expo)
- Web (via Expo Router)

##  Advanced Features

- Real-time video calls with screen sharing
- Offline-first data synchronization
- Performance monitoring and analytics
- Accessibility support (screen readers, haptics)
- Web3 wallet integration
- NFT certificate minting
- Push notifications with deep linking

##  License

MIT License - see LICENSE file for details.
