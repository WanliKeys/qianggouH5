
import React from 'react';
import Header from '../components/Header';
import EmptyState from '../components/EmptyState';

const WithdrawHistory: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="提现记录" />
      <div className="pt-24">
         <EmptyState 
            type="search" 
            message="~空空如也~" 
            actionText="暂无数据" 
            onAction={() => {}} 
            buttonClassName="bg-gray-600 text-white border-none hover:bg-gray-700"
         />
      </div>
    </div>
  );
}

export default WithdrawHistory;
