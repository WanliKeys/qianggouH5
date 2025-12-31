
import React from 'react';
import Header from '../components/Header';
import { MOCK_USER } from '../constants';

const Earnings: React.FC = () => {
  // Mock data based on the screenshot
  const earningsList = [
    { time: '2025-12-02 13:49:24', amount: 50 },
    { time: '2025-12-01 12:48:37', amount: 596 },
    { time: '2025-11-19 10:30:13', amount: 512 },
    { time: '2025-11-18 13:44:59', amount: 789 },
  ];

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <Header title="我的收益" bgClass="bg-white" />

      {/* Gold Card */}
      <div className="mx-4 mt-4 rounded-xl p-8 bg-gradient-to-r from-[#e3c67b] to-[#c69c53] text-white shadow-sm relative overflow-hidden">
         {/* Subtle background decoration */}
         <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
         <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-10 -mb-10 blur-xl"></div>
         
         <div className="flex items-center justify-between text-center relative z-10">
            <div className="flex-1 flex flex-col items-center">
                <div className="text-2xl font-light mb-2">¥ {MOCK_USER.earnings_today || 0}</div>
                <div className="text-sm font-light opacity-90">今日收益</div>
            </div>
            
            {/* Vertical Divider */}
            <div className="w-px h-10 bg-white/40"></div>
            
            <div className="flex-1 flex flex-col items-center">
                <div className="text-2xl font-light mb-2">¥ {MOCK_USER.earnings_total || 1947}</div>
                <div className="text-sm font-light opacity-90">累计收益</div>
            </div>
        </div>
      </div>

      {/* List Header */}
      <div className="px-5 mt-6 mb-3">
          <h3 className="text-green-800 text-base font-normal">收益明细</h3>
      </div>

      {/* Transaction List */}
      <div className="px-4 space-y-3 pb-8">
          {earningsList.map((item, idx) => (
              <div key={idx} className="bg-white rounded-xl py-5 px-4 flex justify-between items-center shadow-sm border border-gray-50">
                  <span className="text-gray-600 text-sm tracking-wide">{item.time}</span>
                  <span className="text-gray-700 text-base font-medium tracking-wide">+ ¥ {item.amount}</span>
              </div>
          ))}
      </div>
    </div>
  );
};

export default Earnings;
