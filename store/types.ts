// Common types used across the application

export interface User {
  id: string;
  walletAddress: string;
  email?: string;
  name: string;
  avatar?: string;
  bio?: string;
  teachingSkills: string[];
  learningSkills: string[];
  rating: number;
  completedSessions: number;
  joinedDate: string;
  isVerified: boolean;
}

export interface Session {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  studentId: string;
  studentName: string;
  skill: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  hourlyRate: string;
  totalAmount: string;
  escrowAmount?: string;
  notes?: string;
  progress?: SessionProgress[];
  rating?: number;
  review?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionProgress {
  id: string;
  milestone: string;
  completed: boolean;
  completedAt?: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  isOnline: boolean;
  responseTime: string;
  completedSessions: number;
  languages: string[];
  verified: boolean;
}

export interface Certificate {
  id: string;
  sessionId: string;
  tutorName: string;
  skill: string;
  completedAt: string;
  progress: number;
  metadata: {
    title: string;
    description: string;
    image?: string;
    attributes: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
  nftData?: {
    tokenId: string;
    contractAddress: string;
    txHash: string;
    mintedAt: string;
  };
  isMinted: boolean;
}

export interface Transaction {
  id: string;
  type: 'sent' | 'received' | 'escrow_lock' | 'escrow_release';
  amount: string;
  token: string;
  from: string;
  to: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  txHash?: string;
  sessionId?: string;
}

export interface WalletData {
  address: string;
  sklBalance: string;
  ethBalance: string;
  transactions: Transaction[];
  connectedWallets: string[];
}

export interface Notification {
  id: string;
  type: 'session' | 'message' | 'bid' | 'payment' | 'certificate';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}