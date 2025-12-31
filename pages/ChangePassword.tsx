
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Eye, EyeOff } from 'lucide-react';

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [visibility, setVisibility] = useState({
    old: false,
    new: false,
    confirm: false
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleVisibility = (field: keyof typeof visibility) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = () => {
    // Implement password change logic here
    navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="修改密码" />

      <div className="mt-3 bg-white px-4">
        <div className="flex items-center py-5 border-b border-gray-100">
          <span className="w-24 text-gray-800 text-base">原始密码</span>
          <input 
            type={visibility.old ? "text" : "password"}
            className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none"
            value={formData.oldPassword}
            onChange={(e) => handleChange('oldPassword', e.target.value)}
          />
          <button onClick={() => toggleVisibility('old')} className="text-gray-400 p-2">
            {visibility.old ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center py-5 border-b border-gray-100">
          <span className="w-24 text-gray-800 text-base">新密码</span>
          <input 
            type={visibility.new ? "text" : "password"}
            className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
          />
          <button onClick={() => toggleVisibility('new')} className="text-gray-400 p-2">
            {visibility.new ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-center py-5">
          <span className="w-24 text-gray-800 text-base">确认密码</span>
          <input 
            type={visibility.confirm ? "text" : "password"}
            className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
          />
          <button onClick={() => toggleVisibility('confirm')} className="text-gray-400 p-2">
            {visibility.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <div className="mt-20 px-4">
        <button 
            onClick={handleSubmit}
            className="w-full bg-[#1e5530] text-white py-3 rounded-md text-base font-medium active:bg-[#164225] transition-colors"
        >
          确定提交
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
