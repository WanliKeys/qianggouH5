
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ChevronRight } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="设置" onBack={() => navigate('/profile')} />
      
      <div className="mt-3 space-y-3">
         <div className="bg-white px-4">
             <button onClick={() => navigate('/settings/personal-info')} className="w-full py-4 flex justify-between items-center border-b border-gray-100">
                 <span className="text-gray-800 text-base">个人资料</span>
                 <ChevronRight size={20} className="text-gray-300" />
             </button>
             <button onClick={() => navigate('/settings/security')} className="w-full py-4 flex justify-between items-center">
                 <span className="text-gray-800 text-base">账户与安全</span>
                 <ChevronRight size={20} className="text-gray-300" />
             </button>
         </div>
         <div className="bg-white px-4">
             <button onClick={() => navigate('/admin/login')} className="w-full py-4 flex justify-between items-center border-b border-gray-100">
                 <span className="text-gray-800 text-base">后台管理</span>
                 <ChevronRight size={20} className="text-gray-300" />
             </button>
             <button className="w-full py-4 flex justify-between items-center">
                 <span className="text-gray-800 text-base">关于我们</span>
                 <ChevronRight size={20} className="text-gray-300" />
             </button>
         </div>
      </div>
      
      <div className="px-4 fixed bottom-16 left-0 right-0 max-w-[480px] mx-auto w-full">
          <button onClick={handleLogout} className="w-full bg-[#1e5530] text-white py-3 rounded-md text-base font-medium">
              退出登录
          </button>
          
          <div className="mt-4 text-center text-xs text-gray-500 flex justify-center items-center">
            <span>《凤城庄园用户协议》</span> 
            <span className="mx-1">和</span> 
            <span>《凤城庄园隐私协议》</span>
          </div>
      </div>
    </div>
  );
};

export default Settings;
