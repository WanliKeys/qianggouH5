
import React, { useMemo, useState, useEffect } from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';

const Warehouse: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    const tab = searchParams.get('tab') || 'buyer';
    return tab === 'warehouse' ? 'buyer' : tab;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);

  // Update active tab if URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
        setActiveTab(tabParam === 'warehouse' ? 'buyer' : tabParam);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'buyer', label: '买方仓库' },
    { id: 'seller', label: '卖方仓库' },
    { id: 'payment', label: '付款确认' },
    { id: 'receipt', label: '收款确认' },
    { id: 'complaint', label: '投诉订单' },
    { id: 'shipping', label: '发货状态' },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    api.fetchWarehouses()
      .then((data) => {
        if (!mounted) return;
        setBuyerOrders(data.buyer || []);
        setSellerOrders(data.seller || []);
      })
      .catch((err: any) => {
        if (!mounted) return;
        setError(err.message || '加载失败');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const todayStart = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t.getTime();
  }, []);

  const renderOrderCard = (order: any, variant: 'buyer' | 'seller') => {
    const title = order.product?.title || '未知商品';
    const subtitle = order.product?.subtitle || '';
    const image = order.product?.image || '';
    const createdAt = order.created_at ? order.created_at.slice(0, 16).replace('T', ' ') : '-';

    const isSoldOut = order.status === 'completed' || !!order.sold_at || !!order.sold_to;
    const availableAt = order.available_at ? new Date(order.available_at).getTime() : null;
    const sellerState =
      isSoldOut ? '已售罄' : availableAt && availableAt > Date.now() ? '待上架' : '已上架';

    return (
      <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex p-3 gap-3">
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-800 truncate">{title}</div>
            {subtitle ? <div className="text-xs text-gray-500 truncate mt-0.5">{subtitle}</div> : null}
            <div className="flex items-center justify-between mt-2">
              <div className="text-red-600 font-bold">
                ¥{Number(variant === 'buyer' ? order.price : order.listing_price).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">
                {variant === 'buyer' ? '待付款' : sellerState}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">时间：{createdAt}</div>
            {variant === 'seller' && order.available_at ? (
              <div className="text-xs text-gray-400 mt-1">
                上架：{order.available_at.slice(0, 16).replace('T', ' ')}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  const buyerTodayCount = useMemo(() => {
    return (buyerOrders || []).filter((o) => {
      const t = o.created_at ? new Date(o.created_at).getTime() : 0;
      return t >= todayStart;
    }).length;
  }, [buyerOrders, todayStart]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="我的订单" onBack={() => navigate('/profile')} />
      
      <div className="bg-[#1e5530]">
        <div className="flex items-center justify-between px-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 min-w-[4.5rem] py-3 text-sm transition-all relative text-center whitespace-nowrap
                ${activeTab === tab.id ? 'text-white' : 'text-white/70'}
              `}
            >
              <span className="relative z-10 block pb-1">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-24">
        {error ? (
          <div className="px-4">
            <div className="bg-white rounded-lg p-3 text-sm text-red-500 shadow-sm">{error}</div>
          </div>
        ) : null}

        {loading ? (
          <div className="text-center text-sm text-gray-500">加载中...</div>
        ) : null}

        {!loading && activeTab === 'buyer' && (
          <div className="px-4">
            <div className="text-xs text-gray-500 mb-3">今日抢到：{buyerTodayCount} 件</div>
            {(buyerOrders || []).length ? (
              <div className="space-y-3">
                {(buyerOrders || []).map((o) => renderOrderCard(o, 'buyer'))}
              </div>
            ) : (
              <EmptyState type="order" message="暂无买方仓库商品" />
            )}
          </div>
        )}

        {!loading && activeTab === 'seller' && (
          <div className="px-4">
            {(sellerOrders || []).length ? (
              <div className="space-y-3">
                {(sellerOrders || []).map((o) => renderOrderCard(o, 'seller'))}
              </div>
            ) : (
              <EmptyState type="order" message="暂无卖方仓库商品" />
            )}
          </div>
        )}

        {!loading && !['buyer', 'seller'].includes(activeTab) && (
          <EmptyState type="order" message="暂无数据" />
        )}
      </div>
    </div>
  );
};

export default Warehouse;
