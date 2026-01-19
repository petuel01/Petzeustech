
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
  hasSeenTutorial?: boolean;
  hasDownloaded?: boolean; // New flag for tutorial gating
}

export interface SubscriptionPlan {
  id: string;
  days: number;
  price: number;
  name: string;
  isTrial?: boolean;
  isEducational?: boolean;
}

export interface TutorialStep {
  id: string;
  order: number;
  title: string;
  description: string;
  mediaUrl?: string;
  mediaType: 'image' | 'video';
}

export interface ConfigFile {
  id: string;
  fileName: string;
  planId: string;
  cycleStart: string;
  cycleEnd: string;
  uploadDate: string;
}
