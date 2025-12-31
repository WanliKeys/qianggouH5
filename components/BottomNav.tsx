import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Zap, ShoppingCart, User } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: '首页', path: '/', icon: Home },
    { label: '抢购', path: '/flash-sale', icon: Zap },
    { label: '购物车', path: '/cart', icon: ShoppingCart },
    { label: '我的', path: '/profile', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <item.icon
              size={24}
              className={`mb-1 ${isActive ? 'text-green-700' : 'text-gray-400'}`}
            />
            <span
              className={`text-xs ${isActive ? 'text-green-700 font-medium' : 'text-gray-500'}`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;