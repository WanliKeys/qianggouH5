
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { api } from '../api';
import type { ApiCoupon } from '../types';

const Coupons: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'unused' | 'used' | 'expired'>('unused');
  const [coupons, setCoupons] = useState<ApiCoupon[]>([]);
  const [cashThreshold, setCashThreshold] = useState(100);
  const [error, setError] = useState('');

  useEffect(() => {
    api.fetchCoupons()
      .then((data) => {
        setCoupons(data.coupons);
        setCashThreshold(data.cashThreshold);
      })
      .catch((err) => setError(err.message || '加载失败'));
  }, []);

  const filtered = useMemo(
    () => coupons.filter((coupon) => coupon.status === activeTab),
    [coupons, activeTab]
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="优惠券" />
      
      <div className="flex bg-green-800 text-white text-sm">
          <button 
            onClick={() => setActiveTab('unused')}
            className={`flex-1 py-3 text-center transition-all ${activeTab === 'unused' ? 'border-b-2 border-white font-medium opacity-100' : 'opacity-60 border-b-2 border-transparent'}`}
          >
            未使用
          </button>
          <button 
            onClick={() => setActiveTab('used')}
            className={`flex-1 py-3 text-center transition-all ${activeTab === 'used' ? 'border-b-2 border-white font-medium opacity-100' : 'opacity-60 border-b-2 border-transparent'}`}
          >
            已使用
          </button>
          <button 
            onClick={() => setActiveTab('expired')}
            className={`flex-1 py-3 text-center transition-all ${activeTab === 'expired' ? 'border-b-2 border-white font-medium opacity-100' : 'opacity-60 border-b-2 border-transparent'}`}
          >
            已过期
          </button>
      </div>

      <div className="pt-6 px-4 text-xs text-gray-500">
        推荐奖励为券，累计满 {cashThreshold} 可抵扣现金。
      </div>
      <div className="pt-6">
          {error && <div className="text-center text-xs text-red-500">{error}</div>}
          {!error && filtered.length === 0 && <EmptyState type="coupon" message="暂无数据" />}
          <div className="px-4 space-y-3">
            {filtered.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-800 font-medium">{coupon.reason}</div>
                  <div className="text-xs text-gray-400 mt-1">{coupon.createdAt.slice(0, 10)}</div>
                </div>
                <div className="text-lg font-bold text-red-500">+{coupon.amount}</div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default Coupons;
