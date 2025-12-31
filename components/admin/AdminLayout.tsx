import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* 左侧固定侧边栏 */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo区域 */}
        <div className="h-16 border-b border-slate-200 flex items-center px-6">
          <h1 className="text-lg font-semibold text-slate-800">抢购管理后台</h1>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <AdminSidebar />
        </nav>

        {/* 底部用户信息 */}
        <div className="h-16 border-t border-slate-200 flex items-center px-6 justify-between">
          <span className="text-sm text-slate-600">管理员</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            退出
          </button>
        </div>
      </aside>

      {/* 右侧内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <h2 className="text-lg font-medium text-slate-800">{title}</h2>
        </header>

        {/* 主内容区(可滚动) */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
