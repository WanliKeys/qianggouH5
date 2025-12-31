export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  tags?: string[];
}

export interface User {
  id: string;
  nickname: string;
  phone: string;
  avatar: string;
  balance: number;
  points: number;
  earnings_today: number;
  earnings_total: number;
}

export type OrderStatus = 'pending_pay' | 'pending_ship' | 'pending_receive' | 'pending_comment' | 'all';

export interface NavItem {
  label: string;
  path: string;
  icon: any; // Lucide icon component
}

export interface ApiProduct {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  image: string;
  tags?: string[];
}

export interface ApiLoginResponse {
  message: string;
  user: ApiUser;
  token: string;
}

export interface ApiUser {
  id: string;
  phone: string;
  nickname: string;
  inviteCode: string;
  isMainAccount: boolean;
  agreementSignedAt: string | null;
}

export interface ApiProfile {
  user: ApiUser;
  stats: {
    todayOrders: number;
    remainingQuota: number | null;
    couponsBalance: number;
    referralCount: number;
    couponCashThreshold: number;
  };
}

export interface ApiFlashSale {
  status: 'before_listing' | 'listing' | 'flash_sale';
  openAt: string;
  listingAt: string;
  products: ApiProduct[];
}

export interface ApiCoupon {
  id: string;
  amount: number;
  status: 'unused' | 'used' | 'expired';
  reason: string;
  createdAt: string;
}

export interface ApiReferral {
  id: string;
  nickname: string;
  phone: string;
  createdAt: string;
  reward: number;
}

export interface ApiAddress {
  id?: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
}
