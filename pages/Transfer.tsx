
import React from 'react';
import Header from '../components/Header';

const Transfer: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      <Header title="积分转让" />
      
      <div className="px-6 mt-2">
        {/* Account Input */}
        <div className="flex items-center py-5 border-b border-gray-100">
           <label className="text-gray-800 text-base mr-2 whitespace-nowrap">转入账号：</label>
           <input 
             type="text" 
             placeholder="请输入转入账号" 
             className="flex-1 outline-none text-gray-600 placeholder-gray-400 text-base bg-transparent shadow-none appearance-none" 
           />
        </div>
        
        {/* Amount Input */}
        <div className="flex items-center py-5 border-b border-gray-100">
           <label className="text-gray-800 text-base mr-2 whitespace-nowrap">数量：</label>
           <input 
             type="number" 
             placeholder="请输入" 
             className="flex-1 outline-none text-gray-600 placeholder-gray-400 text-base bg-transparent shadow-none appearance-none" 
           />
        </div>
        
        {/* Confirm Button */}
        <div className="mt-16 px-4">
            <button className="w-full bg-[#34C759] text-white py-3 rounded-full text-lg tracking-wide active:bg-[#2da84e] transition-colors">
                确认
            </button>
        </div>
      </div>
    </div>
  );
};

export default Transfer;
