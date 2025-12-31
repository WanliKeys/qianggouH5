import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Wallet,
  Settings
} from 'lucide-react';

interface MenuItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: <LayoutDashboard size={18} />,
    path: '/admin/dashboard'
  },
  {
    key: 'orders',
    label: '订单管理',
    icon: <ShoppingCart size={18} />,
    path: '/admin/orders'
  },
  {
    key: 'products',
    label: '商品管理',
    icon: <Package size={18} />,
    path: '/admin/products'
  },
  {
    key: 'members',
    label: '会员管理',
    icon: <Users size={18} />,
    path: '/admin/members'
  },
  {
    key: 'commission',
    label: '佣金管理',
    icon: <Wallet size={18} />,
    path: '/admin/commission'
  },
  {
    key: 'settings',
    label: '系统设置',
    icon: <Settings size={18} />,
    path: '/admin/settings'
  }
];

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="space-y-2">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-green-50 text-green-700 font-medium'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className={isActive ? 'text-green-700' : 'text-slate-500'}>
              {item.icon}
            </span>
            <span className="text-sm">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default AdminSidebar;
