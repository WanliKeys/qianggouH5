import type { ApiAddress, ApiCoupon, ApiFlashSale, ApiLoginResponse, ApiProduct, ApiProfile, ApiReferral } from './types';
import { supabase, callEdgeFunction } from './supabaseClient';

const getToken = () => localStorage.getItem('authToken') || '';
const setToken = (token: string) => localStorage.setItem('authToken', token);

export const api = {
  setToken,

  // Auth endpoints
  sendCode: async (phone: string) => {
    return await callEdgeFunction('auth', { action: 'send-code', phone });
  },

  register: async (payload: { phone: string; code: string; inviteCode: string; password: string }) => {
    const data = await callEdgeFunction('auth', { action: 'register', ...payload });
    if (data.token) {
      setToken(data.token);
      // 缓存用户基本信息
      if (data.user) {
        localStorage.setItem('userProfile', JSON.stringify({
          user: {
            id: data.user.id,
            phone: data.user.phone,
            nickname: data.user.nickname,
            inviteCode: data.user.invite_code,
            isMainAccount: data.user.is_main_account,
            agreementSignedAt: data.user.agreement_signed_at,
          },
          stats: {
            todayOrders: 0,
            remainingQuota: 3,
            couponsBalance: 0,
            referralCount: 0,
            couponCashThreshold: 100,
          }
        }));
      }
    }
    return data as ApiLoginResponse;
  },

  login: async (payload: { phone: string; password: string }) => {
    const data = await callEdgeFunction('auth', { action: 'login', ...payload });
    if (data.token) {
      setToken(data.token);
      // 缓存用户基本信息
      if (data.user) {
        localStorage.setItem('userProfile', JSON.stringify({
          user: {
            id: data.user.id,
            phone: data.user.phone,
            nickname: data.user.nickname,
            inviteCode: data.user.invite_code,
            isMainAccount: data.user.is_main_account,
            agreementSignedAt: data.user.agreement_signed_at,
          },
          stats: {
            todayOrders: 0,
            remainingQuota: 3,
            couponsBalance: 0,
            referralCount: 0,
            couponCashThreshold: 100,
          }
        }));
      }
    }
    return data as ApiLoginResponse;
  },

  // User endpoints
  fetchProfile: async () => {
    const token = getToken();
    const data = await callEdgeFunction('auth', { action: 'get-profile', userId: token });
    return data as ApiProfile;
  },

  // Products
  fetchProducts: async () => {
    const { data: products } = await supabase
      .from('products')
      .select('*');

    const { data: config } = await supabase
      .from('config')
      .select('daily_increase_rate, base_date')
      .eq('id', 1)
      .single();

    const productsWithPrice = await Promise.all((products || []).map(async (product) => {
      const { data: price } = await supabase
        .rpc('get_price_for_today', {
          base_price: product.base_price,
          rate: config?.daily_increase_rate || 0.05,
          base_date: config?.base_date || '2024-01-01'
        });

      return {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        price: price || product.base_price,
        image: product.image,
        tags: product.tags
      };
    }));

    return { products: productsWithPrice } as { products: ApiProduct[] };
  },

  // Flash sale
  fetchFlashSale: async () => {
    const { data: config } = await supabase
      .from('config')
      .select('*')
      .eq('id', 1)
      .single();

    const { data: statusData } = await supabase
      .rpc('get_time_status', {
        listing_start: config?.listing_start || '10:00',
        flash_sale_start: config?.flash_sale_start || '10:30'
      });

    const { data: products } = await supabase
      .from('products')
      .select('*');

    const productsWithPrice = await Promise.all((products || []).map(async (product) => {
      const { data: price } = await supabase
        .rpc('get_price_for_today', {
          base_price: product.base_price,
          rate: config?.daily_increase_rate || 0.05,
          base_date: config?.base_date || '2024-01-01'
        });

      return {
        id: product.id,
        title: product.title,
        subtitle: product.subtitle,
        price: price || product.base_price,
        image: product.image,
        tags: product.tags
      };
    }));

    return {
      status: statusData,
      openAt: config?.flash_sale_start || '10:30',
      listingAt: config?.listing_start || '10:00',
      products: productsWithPrice
    } as ApiFlashSale;
  },

  createFlashOrder: async (payload: {
    productId: string;
    note: string;
    usePoints: boolean;
    signature: string;
    agreementAccepted: boolean;
  }) => {
    const token = getToken();
    return await callEdgeFunction('flash-sale', {
      action: 'create-order',
      productId: payload.productId,
      note: payload.note,
      signature: payload.signature,
      agreementAccepted: payload.agreementAccepted
    }, token);
  },

  // Orders
  fetchOrders: async () => {
    const token = getToken();
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', token)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // 转换字段名从 snake_case 到 camelCase
    const mappedOrders = (orders || []).map(order => ({
      id: order.id,
      userId: order.user_id,
      productId: order.product_id,
      price: Number(order.price),
      listingPrice: Number(order.listing_price),
      listingFee: Number(order.listing_fee),
      commissionFee: Number(order.commission_fee),
      platformServiceFee: Number(order.platform_service_fee),
      memberProfit: Number(order.member_profit),
      note: order.note,
      status: order.status,
      parentId: order.parent_id,
      splitIndex: order.split_index,
      splitTotal: order.split_total,
      assignedTo: order.assigned_to,
      assignedAt: order.assigned_at,
      paidAt: order.paid_at,
      listedAt: order.listed_at,
      availableAt: order.available_at,
      splitAt: order.split_at,
      createdAt: order.created_at
    }));

    return { orders: mappedOrders };
  },

  // Referrals
  fetchReferrals: async () => {
    const token = getToken();
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        id,
        created_at,
        referred_user:users!referrals_referred_user_id_fkey(nickname, phone)
      `)
      .eq('referrer_id', token)
      .order('created_at', { ascending: false });

    const { data: config } = await supabase
      .from('config')
      .select('referral_reward_per_user')
      .eq('id', 1)
      .single();

    const mappedReferrals = (referrals || []).map((ref: any) => ({
      id: ref.id,
      nickname: ref.referred_user?.nickname || '新用户',
      phone: ref.referred_user?.phone || '-',
      createdAt: ref.created_at,
      reward: config?.referral_reward_per_user || 10
    }));

    return { referrals: mappedReferrals } as { referrals: ApiReferral[] };
  },

  // Coupons
  fetchCoupons: async () => {
    const token = getToken();
    const { data: coupons } = await supabase
      .from('coupons')
      .select('*')
      .eq('user_id', token)
      .order('created_at', { ascending: false });

    const { data: config } = await supabase
      .from('config')
      .select('coupon_cash_threshold')
      .eq('id', 1)
      .single();

    const mappedCoupons = (coupons || []).map(c => ({
      id: c.id,
      amount: Number(c.amount),
      status: c.status,
      reason: c.reason,
      createdAt: c.created_at
    }));

    return {
      coupons: mappedCoupons,
      cashThreshold: config?.coupon_cash_threshold || 100
    } as { coupons: ApiCoupon[]; cashThreshold: number };
  },

  // Addresses
  fetchAddresses: async () => {
    const token = getToken();
    const { data: addresses } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', token)
      .order('created_at', { ascending: false });

    return { addresses: addresses || [] } as { addresses: ApiAddress[] };
  },

  addAddress: async (payload: ApiAddress) => {
    const token = getToken();
    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: token,
        name: payload.name,
        phone: payload.phone,
        region: payload.region,
        detail: payload.detail,
        is_default: payload.isDefault
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { address };
  },

  // Payment Methods
  fetchPaymentMethods: async () => {
    const token = getToken();
    const { data: paymentMethods, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', token);

    if (error) throw new Error(error.message);

    return { paymentMethods: paymentMethods || [] };
  },

  savePaymentMethod: async (payload: { type: string; details: any }) => {
    const token = getToken();
    const { data, error } = await supabase
      .from('payment_methods')
      .upsert({
        user_id: token,
        type: payload.type,
        details: payload.details
      }, {
        onConflict: 'user_id,type'
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    return { paymentMethod: data };
  },

  // Admin endpoints
  adminLogin: async (payload: { username: string; password: string }) => {
    return await callEdgeFunction('admin', {
      action: 'login',
      ...payload
    });
  },

  adminFetchConfig: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-config' }, token);
  },

  adminUpdateConfig: async (payload: { listingStart: string; flashSaleStart: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'update-config',
      listingStart: payload.listingStart,
      flashSaleStart: payload.flashSaleStart
    }, token);
  },

  adminFetchOrders: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-orders' }, token);
  },

  adminMarkPaid: async (payload: { orderId: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'mark-paid',
      orderId: payload.orderId
    }, token);
  },

  adminSplitOrder: async (payload: { orderId: string; parts: number }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'split-order',
      orderId: payload.orderId,
      parts: payload.parts
    }, token);
  },

  adminAssignOrder: async (payload: { orderId: string; assignee: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'assign-order',
      orderId: payload.orderId,
      assignee: payload.assignee
    }, token);
  },

  adminAddOrder: async (payload: { userId: string; productId: string; note?: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'add-order',
      userId: payload.userId,
      productId: payload.productId,
      note: payload.note
    }, token);
  },

  // Product Management
  adminGetProducts: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-products' }, token);
  },

  adminAddProduct: async (payload: { title: string; subtitle?: string; basePrice: number; image?: string; tags?: string[] }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'add-product',
      title: payload.title,
      subtitle: payload.subtitle,
      basePrice: payload.basePrice,
      image: payload.image,
      tags: payload.tags
    }, token);
  },

  adminUpdateProduct: async (payload: { productId: string; title?: string; subtitle?: string; basePrice?: number; image?: string; tags?: string[] }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'update-product',
      productId: payload.productId,
      title: payload.title,
      subtitle: payload.subtitle,
      basePrice: payload.basePrice,
      image: payload.image,
      tags: payload.tags
    }, token);
  },

  adminDeleteProduct: async (payload: { productId: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'delete-product',
      productId: payload.productId
    }, token);
  },

  // Member Management
  adminGetUsers: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-users' }, token);
  },

  adminGetUserDetail: async (payload: { userId: string }) => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', {
      action: 'get-user-detail',
      userId: payload.userId
    }, token);
  },

  // Coupon Management
  adminGetCouponRecords: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-coupon-records' }, token);
  },

  adminGetCouponRedemptions: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-coupon-redemptions' }, token);
  },

  // Dashboard Stats
  adminGetDashboardStats: async () => {
    const token = localStorage.getItem('adminToken') || '';
    return await callEdgeFunction('admin', { action: 'get-dashboard-stats' }, token);
  }
};
