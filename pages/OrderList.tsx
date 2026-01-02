
import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { api } from '../api';

const OrderList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentStatus = searchParams.get('status') || 'all';
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'pay', label: '待付款' },
    { id: 'ship', label: '待发货' },
    { id: 'receive', label: '待收货' },
    { id: 'comment', label: '待评价' },
  ];

  const handleTabClick = (id: string) => {
    if (id === 'all') {
      navigate('/orders');
    } else {
      navigate(`/orders?status=${id}`);
    }
  };

  useEffect(() => {
    api.fetchOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message || '加载失败'));
  }, []);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_pay: '待付款',
      listed: '已上架',
      split: '已拆分',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  };

  const filteredOrders = useMemo(() => {
    if (currentStatus === 'all') return orders;
    const statusMap: Record<string, string> = {
      pay: 'pending_pay',
      ship: 'pending_ship',
      receive: 'pending_receive',
      comment: 'pending_comment'
    };
    return orders.filter((order) => order.status === statusMap[currentStatus]);
  }, [orders, currentStatus]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header 
        title="我的订单" 
        bgClass="bg-white" 
        textClass="text-gray-800"
        onBack={() => navigate('/profile')}
      />
      
      <div className="bg-[#1e5530]">
        <div className="flex items-center justify-between px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`
                flex-1 py-3 text-sm transition-all relative text-center
                ${currentStatus === tab.id ? 'text-white font-medium' : 'text-white/70'}
              `}
            >
              <span className="relative z-10 block pb-1">{tab.label}</span>
              {currentStatus === tab.id && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-6 px-4">
          {error && <div className="text-center text-xs text-red-500">{error}</div>}
          {!error && filteredOrders.length === 0 && <EmptyState type="order" message="暂无数据" />}
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>订单号 {order.id.slice(-6)}</span>
                  <span className="text-green-700">{getStatusText(order.status)}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  抢单价 ¥{order.price.toFixed(2)} ｜ 上架价 ¥{order.listingPrice.toFixed(2)}
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  创建时间 {order.createdAt.slice(0, 16).replace('T', ' ')}
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default OrderList;
