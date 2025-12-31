
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { api } from '../api';
const Login: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!phone || !password) {
      setError('请输入手机号和密码');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.login({ phone, password });
      localStorage.setItem('authToken', res.token);
      navigate('/');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-10 px-8 relative">
       {/* Back Button */}
       <button 
         onClick={() => navigate(-1)} 
         className="absolute top-4 left-4 p-2 text-gray-600 rounded-full active:bg-gray-100 z-10"
       >
         <ChevronLeft size={24} />
       </button>

       {/* Logo */}
       <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mb-12 shadow-lg relative overflow-hidden mt-8">
            <div className="w-8 h-8 bg-gray-200 rounded-full absolute top-4"></div>
            <div className="w-16 h-1 bg-gray-600 absolute bottom-8"></div>
       </div>

       {/* Form */}
       <div className="w-full space-y-6">
           <div className="relative border-b border-gray-300 pb-2">
               {/* pointer-events-none ensures clicks pass through these spans to the input */}
               <span className="absolute left-0 top-0 text-lg font-medium text-gray-700 pointer-events-none select-none">手机号</span>
               <span className="absolute left-16 top-0.5 text-base text-gray-800 font-medium pointer-events-none select-none">+86</span>
               <input 
                 type="tel" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full pl-28 outline-none text-lg shadow-none appearance-none bg-transparent placeholder-gray-300 block"
                 placeholder="请输入手机号"
               />
           </div>

            <div className="relative border-b border-gray-300 pb-2 flex items-center justify-between">
               <span className="text-lg font-medium text-gray-700 whitespace-nowrap mr-4">密码</span>
               <input 
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="flex-1 outline-none text-lg shadow-none appearance-none bg-transparent placeholder-gray-300 block"
                 placeholder="请输入密码"
               />
           </div>
       </div>

       {/* Submit */}
       <button 
        onClick={handleLogin}
        disabled={submitting}
        className={`w-full py-3 rounded-md mt-12 text-lg font-medium transition-colors active:scale-[0.98] ${submitting ? 'bg-gray-300 text-gray-600' : 'bg-green-800 text-white hover:bg-green-900'}`}
       >
           {submitting ? '登录中...' : '登录'}
       </button>
       {error && <div className="mt-3 text-center text-xs text-red-500">{error}</div>}

       <div className="flex justify-center w-full mt-6 text-sm text-gray-500">
           <button onClick={() => navigate('/register')} className="text-gray-500 hover:text-green-800">立即注册</button>
           <span className="mx-2">|</span>
           <button onClick={() => navigate('/forgot-password')} className="text-gray-500 hover:text-green-800">忘记密码?</button>
       </div>

       {/* Footer Agreement */}
       <div className="mt-auto mb-8 flex items-center text-xs text-gray-500">
           <div className="w-4 h-4 rounded-full border border-green-600 mr-2"></div>
           <span>《凤城庄园用户协议》和《凤城庄园隐私协议》</span>
       </div>
    </div>
  );
};

export default Login;
