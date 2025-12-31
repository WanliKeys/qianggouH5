
import React from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

const FansOrders: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="粉丝订单" />
      
       {/* Gold Card */}
      <div className="mx-4 mt-4 rounded-lg p-6 bg-gradient-to-r from-[#e3c67b] to-[#c69c53] text-white shadow-md">
        <div className="flex text-center relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30 transform -translate-x-1/2"></div>
            <div className="flex-1">
                <div className="text-2xl font-medium">¥ 0</div>
                <div className="text-xs opacity-90 mt-1">订单总金额</div>
            </div>
            <div className="flex-1">
                <div className="text-2xl font-medium">0</div>
                <div className="text-xs opacity-90 mt-1">订单数</div>
            </div>
        </div>
      </div>

      <div className="pt-16">
         <EmptyState 
            type="search" 
            message="~空空如也~" 
            actionText="暂无更多" 
            onAction={() => {}} 
            buttonClassName="bg-gray-600 text-white border-none hover:bg-gray-700"
         />
      </div>
    </div>
  );
}
export default FansOrders;
