
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    inviteCode: '',
    password: ''
  });
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendCode = async () => {
    if (!formData.phone) {
      setError('请输入手机号');
      return;
    }
    setSending(true);
    setError('');
    try {
      await api.sendCode(formData.phone);
    } catch (err: any) {
      setError(err.message || '发送失败');
    } finally {
      setSending(false);
    }
  };

  const handleRegister = async () => {
    if (!formData.phone || !formData.code || !formData.inviteCode || !formData.password) {
      setError('手机号、验证码、邀请码、密码为必填');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.register(formData);
      api.setToken(res.token);
      navigate('/profile');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
       {/* Header */}
       <div className="w-full relative flex items-center justify-center py-4">
           <button 
             onClick={() => navigate(-1)} 
             className="absolute left-4 p-2 text-gray-800"
           >
             <ChevronLeft size={24} />
           </button>
           <h1 className="text-lg font-medium text-gray-800">新用户注册</h1>
       </div>

       {/* Logo Area */}
       <div className="mt-8 mb-10">
            <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center overflow-hidden border-4 border-gray-50 shadow-sm">
                {/* Placeholder for the jade pendant image */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-green-300 shadow-inner flex items-center justify-center">
                   <div className="w-1 h-8 bg-red-800 absolute -mt-10"></div>
                   <div className="w-24 h-24 rounded-full border border-white/50 bg-white/30 backdrop-blur-sm"></div>
                </div>
            </div>
       </div>

       {/* Form */}
       <div className="w-full px-8 space-y-2">
           {/* Phone */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-16">手机号</span>
               <span className="text-gray-800 text-lg mr-4">+86</span>
               <input 
                 type="tel" 
                 value={formData.phone}
                 onChange={(e) => handleChange('phone', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
           </div>

           {/* Verification Code */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-16">验证码</span>
               <input 
                 type="text" 
                 value={formData.code}
                 onChange={(e) => handleChange('code', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
               <button
                 onClick={handleSendCode}
                 disabled={sending}
                 className={`text-xs px-4 py-2 rounded shadow-sm whitespace-nowrap ${sending ? 'bg-gray-300 text-gray-600' : 'bg-[#2d5d39] text-white'}`}
               >
                   {sending ? '发送中' : '获取验证码'}
               </button>
           </div>

           {/* Invite Code */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-16">邀请码</span>
               <input 
                 type="text" 
                 value={formData.inviteCode}
                 onChange={(e) => handleChange('inviteCode', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
           </div>

           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-16">密码</span>
               <input 
                 type="password" 
                 value={formData.password}
                 onChange={(e) => handleChange('password', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
           </div>
       </div>

       {/* Submit Button */}
       <div className="w-full px-8 mt-16">
           <button 
            onClick={handleRegister}
            disabled={submitting}
            className={`w-full py-3 rounded-md text-lg font-medium transition-colors shadow-md ${submitting ? 'bg-gray-300 text-gray-600' : 'bg-[#2d5d39] text-white hover:bg-[#244a2d]'}`}
           >
               {submitting ? '提交中...' : '下一步'}
           </button>
           {error && <div className="mt-3 text-center text-xs text-red-500">{error}</div>}
       </div>
    </div>
  );
};

export default Register;
