import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { Column } from '../../components/admin/DataTable';
import { api } from '../../api';

interface Coupon {
  id: string;
  user_id: string;
  amount: number;
  status: string;
  reason: string;
  created_at: string;
  user?: {
    id: string;
    nickname: string;
    phone: string;
  };
}

interface CouponRedemption {
  id: string;
  user_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: string;
  created_at: string;
  processed_at?: string;
  user?: {
    id: string;
    nickname: string;
    phone: string;
  };
}

const CouponManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'records' | 'redemptions'>('records');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemption[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchCoupons();
    fetchRedemptions();
  }, [navigate]);

  const fetchCoupons = async () => {
    try {
      const data = await api.adminGetCouponRecords();
      setCoupons(data.coupons);
    } catch (err: any) {
      setError(err.message || '加载优惠券记录失败');
    }
  };

  const fetchRedemptions = async () => {
    try {
      const data = await api.adminGetCouponRedemptions();
      setRedemptions(data.redemptions);
    } catch (err: any) {
      setError(err.message || '加载兑换记录失败');
    }
  };

  const couponColumns: Column[] = [
    {
      key: 'id',
      label: '优惠券ID',
      width: '12%',
      render: (value) => value.slice(-8)
    },
    {
      key: 'user',
      label: '会员信息',
      width: '18%',
      render: (user) => (
        <div>
          <div className="font-medium">{user?.nickname || '未知'}</div>
          <div className="text-xs text-slate-500">{user?.phone || '-'}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: '金额',
      width: '12%',
      render: (value) => (
        <span className="text-green-700 font-medium">¥{value.toFixed(2)}</span>
      )
    },
    {
      key: 'status',
      label: '状态',
      width: '12%',
      render: (value) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          unused: { text: '未使用', color: 'blue' },
          used: { text: '已使用', color: 'slate' },
          expired: { text: '已过期', color: 'red' }
        };
        const status = statusMap[value] || { text: value, color: 'slate' };
        return (
          <span className={`inline-block px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs rounded`}>
            {status.text}
          </span>
        );
      }
    },
    {
      key: 'reason',
      label: '来源',
      width: '25%'
    },
    {
      key: 'created_at',
      label: '创建时间',
      width: '21%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    }
  ];

  const redemptionColumns: Column[] = [
    {
      key: 'id',
      label: '兑换ID',
      width: '10%',
      render: (value) => value.slice(-8)
    },
    {
      key: 'user',
      label: '会员信息',
      width: '15%',
      render: (user) => (
        <div>
          <div className="font-medium">{user?.nickname || '未知'}</div>
          <div className="text-xs text-slate-500">{user?.phone || '-'}</div>
        </div>
      )
    },
    {
      key: 'amount',
      label: '金额',
      width: '10%',
      render: (value) => (
        <span className="text-green-700 font-medium">¥{value.toFixed(2)}</span>
      )
    },
    {
      key: 'bank_name',
      label: '银行信息',
      width: '20%',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-slate-500">{row.account_number}</div>
          <div className="text-xs text-slate-500">{row.account_name}</div>
        </div>
      )
    },
    {
      key: 'status',
      label: '状态',
      width: '10%',
      render: (value) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          pending: { text: '待处理', color: 'yellow' },
          approved: { text: '已通过', color: 'green' },
          rejected: { text: '已拒绝', color: 'red' }
        };
        const status = statusMap[value] || { text: value, color: 'slate' };
        return (
          <span className={`inline-block px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs rounded`}>
            {status.text}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: '申请时间',
      width: '17%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    },
    {
      key: 'processed_at',
      label: '处理时间',
      width: '18%',
      render: (value) => value ? value.slice(0, 16).replace('T', ' ') : '-'
    }
  ];

  const totalCouponAmount = coupons.reduce((sum, c) => sum + Number(c.amount), 0);
  const unusedCouponAmount = coupons
    .filter(c => c.status === 'unused')
    .reduce((sum, c) => sum + Number(c.amount), 0);
  const totalRedemptionAmount = redemptions.reduce((sum, r) => sum + Number(r.amount), 0);
  const pendingRedemptionAmount = redemptions
    .filter(r => r.status === 'pending')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  return (
    <AdminLayout title="优惠券管理">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 mb-1">优惠券总额</div>
          <div className="text-2xl font-bold text-green-700">¥{totalCouponAmount.toFixed(2)}</div>
          <div className="text-xs text-green-600 mt-1">共 {coupons.length} 张</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 mb-1">未使用金额</div>
          <div className="text-2xl font-bold text-blue-700">¥{unusedCouponAmount.toFixed(2)}</div>
          <div className="text-xs text-blue-600 mt-1">
            {coupons.filter(c => c.status === 'unused').length} 张未使用
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4">
          <div className="text-sm text-purple-600 mb-1">兑换总额</div>
          <div className="text-2xl font-bold text-purple-700">¥{totalRedemptionAmount.toFixed(2)}</div>
          <div className="text-xs text-purple-600 mt-1">共 {redemptions.length} 笔</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="text-sm text-yellow-600 mb-1">待处理金额</div>
          <div className="text-2xl font-bold text-yellow-700">¥{pendingRedemptionAmount.toFixed(2)}</div>
          <div className="text-xs text-yellow-600 mt-1">
            {redemptions.filter(r => r.status === 'pending').length} 笔待处理
          </div>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('records')}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'records'
              ? 'text-green-700 border-b-2 border-green-700'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          优惠券记录
        </button>
        <button
          onClick={() => setActiveTab('redemptions')}
          className={`pb-3 px-4 text-sm font-medium transition-colors ${
            activeTab === 'redemptions'
              ? 'text-green-700 border-b-2 border-green-700'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          兑换记录
        </button>
      </div>

      {/* 数据表格 */}
      {activeTab === 'records' ? (
        <DataTable columns={couponColumns} data={coupons} emptyText="暂无优惠券记录" />
      ) : (
        <DataTable columns={redemptionColumns} data={redemptions} emptyText="暂无兑换记录" />
      )}
    </AdminLayout>
  );
};

export default CouponManagement;
