
import React, { useState } from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

const Commission: React.FC = () => {
  const [tab, setTab] = useState<'received' | 'unreceived'>('unreceived');

  const list = [
    { title: '欢乐', source: '下级139****7860转拍佣金', time: '2025-12-22 20:04:05', amount: 0.00 },
    { title: '可心儿', source: '下级135****0632转拍佣金', time: '2025-12-22 20:03:54', amount: 30.22 },
    { title: '可心儿', source: '下级135****0632转拍佣金', time: '2025-12-22 20:03:53', amount: 22.05 },
    { title: '欢乐', source: '下级139****7860转拍佣金', time: '2025-12-19 16:24:00', amount: 0.00 },
    { title: '可心儿', source: '下级135****0632转拍佣金', time: '2025-12-19 16:23:50', amount: 48.41 },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <Header title="我的佣金" />
      
      {/* Tabs */}
      <div className="bg-green-800 p-1 mx-4 mt-4 rounded-full flex text-sm">
        <button 
          onClick={() => setTab('received')}
          className={`flex-1 py-1.5 rounded-full text-center transition-colors ${tab === 'received' ? 'bg-white text-green-800 font-medium' : 'text-white/70'}`}
        >
          已到账
        </button>
        <button 
          onClick={() => setTab('unreceived')}
          className={`flex-1 py-1.5 rounded-full text-center transition-colors ${tab === 'unreceived' ? 'bg-white text-green-800 font-medium' : 'text-white/70'}`}
        >
          未到账
        </button>
      </div>

      {/* Gold Card */}
      <div className="mx-4 mt-4 rounded-lg p-6 bg-gradient-to-r from-[#e3c67b] to-[#c69c53] text-white shadow-md">
        <div className="flex text-center relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2"></div>
            <div className="flex-1">
                <div className="text-2xl font-medium">¥ 795.64</div>
                <div className="text-xs opacity-90 mt-1">佣金总数</div>
            </div>
            <div className="flex-1">
                <div className="text-2xl font-medium">88</div>
                <div className="text-xs opacity-90 mt-1">订单数</div>
            </div>
        </div>
      </div>

      {/* Detail List or Empty State */}
      <div className="px-4 mt-6">
          <h3 className="text-gray-600 mb-2 text-sm">佣金明细</h3>
          
          {tab === 'received' ? (
             <div className="space-y-2">
                {list.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-gray-800 font-medium">{item.title}</span>
                            <span className="text-gray-800 font-medium">¥ {item.amount.toFixed(2)}</span>
                        </div>
                        <div className="text-xs text-gray-400">来源: {item.source}</div>
                        <div className="text-xs text-gray-400 mt-1">{item.time}</div>
                    </div>
                ))}
             </div>
          ) : (
             <div className="py-12">
                 <EmptyState type="search" message="~空空如也~" />
             </div>
          )}
      </div>
    </div>
  );
}

export default Commission;
