
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Warehouse: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'warehouse');

  // Update active tab if URL changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
        setActiveTab(tabParam);
    }
  }, [searchParams]);

  const tabs = [
    { id: 'warehouse', label: '我的仓库' },
    { id: 'payment', label: '付款确认' },
    { id: 'receipt', label: '收款确认' },
    { id: 'complaint', label: '投诉订单' },
    { id: 'shipping', label: '发货状态' },
  ];

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
         <EmptyState type="order" message="暂无数据" />
      </div>
    </div>
  );
};

export default Warehouse;
