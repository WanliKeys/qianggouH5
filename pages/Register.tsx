
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    inviteCode: '',
    password: ''
  });
  const [sending, setSending] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 从URL参数中获取邀请码并自动填充
  useEffect(() => {
    const inviteCodeFromUrl = searchParams.get('inviteCode');
    if (inviteCodeFromUrl) {
      setFormData(prev => ({ ...prev, inviteCode: inviteCodeFromUrl }));
    }
  }, [searchParams]);

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

    // 模拟发送验证码,生成随机6位数字
    setTimeout(() => {
      const mockCode = Math.floor(100000 + Math.random() * 900000).toString();
      setFormData(prev => ({ ...prev, code: mockCode }));
      setSending(false);
      // 可选:显示成功提示
      setError('验证码已发送到您的手机');
      setTimeout(() => setError(''), 2000);
    }, 1000);
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
                 placeholder="请输入手机号"
                 className="flex-1 outline-none text-lg bg-transparent placeholder-gray-400"
               />
           </div>

           {/* Verification Code */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-20 whitespace-nowrap">验证码</span>
               <input
                 type="text"
                 value={formData.code}
                 onChange={(e) => handleChange('code', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent mr-2"
               />
               <button
                 onClick={handleSendCode}
                 disabled={sending}
                 className={`text-xs px-3 py-2 rounded shadow-sm whitespace-nowrap ${sending ? 'bg-gray-300 text-gray-600' : 'bg-[#2d5d39] text-white'}`}
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

       {/* Error Message */}
       {error && (
         <div className="w-full px-8 mt-6">
           <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex items-center justify-center">
             <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
             </svg>
             <span className="text-base font-medium text-red-600">{error}</span>
           </div>
         </div>
       )}

       {/* Submit Button */}
       <div className="w-full px-8 mt-8">
           <button
            onClick={handleRegister}
            disabled={submitting}
            className={`w-full py-3 rounded-md text-lg font-medium transition-colors shadow-md ${submitting ? 'bg-gray-300 text-gray-600' : 'bg-[#2d5d39] text-white hover:bg-[#244a2d]'}`}
           >
               {submitting ? '提交中...' : '下一步'}
           </button>
       </div>
    </div>
  );
};

export default Register;
