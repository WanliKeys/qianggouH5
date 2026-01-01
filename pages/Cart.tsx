
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Header from '../components/Header';

// Simple global state simulation could be here, but using local for demo
const Cart: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // 检查 localStorage 中是否有 authToken
    return !!localStorage.getItem('authToken');
  });
  const navigate = useNavigate();

  useEffect(() => {
    // 监听登录状态变化
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem('authToken'));
    };

    // 设置定时检查（可选）
    const interval = setInterval(checkAuth, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isLoggedIn) {
      return (
          <div className="flex flex-col min-h-screen bg-white">
              <Header 
                  title="购物车" 
                  rightAction={<button className="text-sm text-gray-600">编辑</button>} 
                  showBack={false}
              />
              
              <div className="flex-1 flex flex-col items-center pt-24">
                  <EmptyState 
                    type="cart" 
                    message="您的购物车是空的，请登录后操作" 
                  />
                  <div className="flex gap-4 mt-4">
                      <button 
                        onClick={() => navigate('/')}
                        className="border border-green-700 text-green-700 px-8 py-2 rounded bg-white w-32"
                      >
                          去逛逛
                      </button>
                       <button 
                        onClick={() => navigate('/login')}
                        className="border border-green-700 text-green-700 px-8 py-2 rounded bg-white w-32"
                      >
                          登录
                      </button>
                  </div>
              </div>

               {/* Mock footer usually visible on cart */}
              <div className="border-t border-gray-100 p-2 flex items-center justify-between bg-white mb-16">
                  <div className="flex items-center pl-2">
                      <div className="w-5 h-5 rounded-full border border-gray-300 mr-2"></div>
                      <span className="text-sm text-gray-600">全选</span>
                      <span className="ml-4 text-sm text-gray-800">合计: <span className="font-medium text-red-600">¥ 0</span></span>
                  </div>
                  <button className="bg-green-800 text-white px-8 py-2 rounded-sm text-sm">
                      结算
                  </button>
              </div>
          </div>
      )
  }

  return (
    <div>
      <Header 
          title="购物车" 
          rightAction={<button className="text-sm text-gray-600">编辑</button>} 
          showBack={false}
      />
      {/* Logged in cart view would go here */}
    </div>
  );
};

export default Cart;
