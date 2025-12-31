
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { api } from '../api';
import type { ApiReferral } from '../types';

const Fans: React.FC = () => {
  const [list, setList] = useState<ApiReferral[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.fetchReferrals()
      .then((data) => setList(data.referrals))
      .catch((err) => setError(err.message || '加载失败'));
  }, []);

  const todayCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return list.filter((item) => item.createdAt.startsWith(today)).length;
  }, [list]);

  return (
    <div className="bg-gray-100 min-h-screen pb-4">
      <Header title="邀请列表" />
      
       {/* Gold Card */}
      <div className="mx-4 mt-4 rounded-lg p-6 bg-gradient-to-r from-[#e3c67b] to-[#c69c53] text-white shadow-md">
        <div className="flex text-center relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2"></div>
            <div className="flex-1">
                <div className="text-2xl font-medium">{todayCount}</div>
                <div className="text-xs opacity-90 mt-1">今日邀请</div>
            </div>
            <div className="flex-1">
                <div className="text-2xl font-medium">{list.length}</div>
                <div className="text-xs opacity-90 mt-1">历史邀请</div>
            </div>
        </div>
      </div>

      {/* Section Header */}
      <div className="mx-4 mt-4 bg-white border-2 border-green-800 rounded p-2 text-center shadow-sm">
          <span className="text-green-800 text-sm font-medium">分享有礼({list.length})</span>
      </div>

       {/* List */}
       <div className="px-4 mt-4 space-y-3">
           {error && (
             <div className="bg-white p-4 rounded-lg text-sm text-red-500 shadow-sm">
               {error}
             </div>
           )}
           {list.map((item) => (
               <div key={item.id} className="bg-white p-4 rounded-lg flex items-center justify-between shadow-sm">
                   <div className="flex items-center">
                       {/* Avatar or Placeholder */}
                        <div className="w-10 h-10 rounded-full mr-3 overflow-hidden flex-shrink-0">
                           <div className="w-full h-full bg-gray-50 flex items-center justify-center text-xs text-gray-400">
                               无
                           </div>
                        </div>

                       <div>
                           <div className="text-green-800 font-medium text-sm">{item.nickname}</div>
                           <div className="text-xs text-gray-500 mt-1">关注时间: {item.createdAt.slice(0, 16).replace('T', ' ')}</div>
                       </div>
                   </div>
                   <div className="text-green-800 font-medium">+¥ {item.reward}</div>
               </div>
           ))}
       </div>

    </div>
  );
}
export default Fans;
