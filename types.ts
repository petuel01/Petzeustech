
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  PENDING = 'PENDING',
  NONE = 'NONE'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'blocked';
  profilePic?: string;
  isTrialUsed?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  days: number;
  price: number;
  name: string;
  isTrial?: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  expiryDate: string;
  status: SubscriptionStatus;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  amount: number;
  transactionId: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface ConfigFile {
  id: string;
  fileName: string;
  planId: string; // Linked to a specific plan (including Trial)
  cycleStart: string;
  cycleEnd: string;
  uploadDate: string;
}
