import type { ApiAddress, ApiCoupon, ApiFlashSale, ApiLoginResponse, ApiProduct, ApiProfile, ApiReferral } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

const getToken = () => localStorage.getItem('authToken') || '';
const setToken = (token: string) => localStorage.setItem('authToken', token);

const request = async <T>(path: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || '请求失败');
  }
  return data as T;
};

const requestAdmin = async <T>(path: string, options: RequestInit = {}) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  const token = localStorage.getItem('adminToken');
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || '请求失败');
  }
  return data as T;
};

export const api = {
  setToken,
  sendCode: (phone: string) => request<{ message: string; code: string }>(`/api/auth/send-code`, {
    method: 'POST',
    body: JSON.stringify({ phone })
  }),
  register: (payload: { phone: string; code: string; inviteCode: string; password: string }) =>
    request<ApiLoginResponse>(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload: { phone: string; password: string }) =>
    request<ApiLoginResponse>(`/api/auth/login`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  fetchProfile: () => request<ApiProfile>(`/api/user/me`),
  fetchProducts: () => request<{ products: ApiProduct[] }>(`/api/products/today`),
  fetchFlashSale: () => request<ApiFlashSale>(`/api/flash-sale`),
  createFlashOrder: (payload: {
    productId: string;
    note: string;
    usePoints: boolean;
    signature: string;
    agreementAccepted: boolean;
  }) => request<{ order: any; message: string }>(`/api/orders/flash`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  fetchOrders: () => request<{ orders: any[] }>(`/api/orders`),
  adminFetchOrders: () => requestAdmin<{ orders: any[] }>(`/api/admin/orders`),
  adminLogin: (payload: { username: string; password: string }) =>
    request<{ token: string; message: string }>(`/api/admin/login`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminFetchConfig: () =>
    requestAdmin<{ config: { listingStart: string; flashSaleStart: string } }>(`/api/admin/config`),
  adminUpdateConfig: (payload: { listingStart: string; flashSaleStart: string }) =>
    requestAdmin<{ message: string }>(`/api/admin/config`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  adminMarkPaid: (payload: { orderId: string }) =>
    requestAdmin<{ order: any; message: string }>(`/api/admin/orders/mark-paid`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminSplitOrder: (payload: { orderId: string; parts: number }) =>
    requestAdmin<{ message: string }>(`/api/admin/orders/split`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminAssignOrder: (payload: { orderId: string; assignee: string }) =>
    requestAdmin<{ message: string }>(`/api/admin/orders/assign`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  adminAddOrder: (payload: { userId: string; productId: string; note?: string }) =>
    requestAdmin<{ message: string }>(`/api/admin/orders/add`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  fetchReferrals: () => request<{ referrals: ApiReferral[] }>(`/api/referrals`),
  fetchCoupons: () => request<{ coupons: ApiCoupon[]; cashThreshold: number }>(`/api/coupons`),
  fetchAddresses: () => request<{ addresses: ApiAddress[] }>(`/api/addresses`),
  addAddress: (payload: ApiAddress) => request<{ address: ApiAddress }>(`/api/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};
