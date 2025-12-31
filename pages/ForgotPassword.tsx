
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
           <h1 className="text-lg font-medium text-gray-800">忘记密码</h1>
       </div>

       {/* Spacer to push content down slightly like screenshot */}
       <div className="h-10"></div>

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
               <button className="bg-[#2d5d39] text-white text-xs px-4 py-2 rounded shadow-sm whitespace-nowrap">
                   获取验证码
               </button>
           </div>

           {/* Password */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-16">密码</span>
               <input 
                 type={showPwd ? "text" : "password"}
                 value={formData.password}
                 onChange={(e) => handleChange('password', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
               <button onClick={() => setShowPwd(!showPwd)} className="text-gray-400 p-1">
                   {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
           </div>

           {/* Confirm Password */}
           <div className="flex items-center py-4 border-b border-green-800/30">
               <span className="text-gray-600 text-base w-20">确认密码</span>
               <input 
                 type={showConfirmPwd ? "text" : "password"}
                 value={formData.confirmPassword}
                 onChange={(e) => handleChange('confirmPassword', e.target.value)}
                 className="flex-1 outline-none text-lg bg-transparent"
               />
               <button onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="text-gray-400 p-1">
                   {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
               </button>
           </div>
       </div>

       {/* Submit Button */}
       <div className="w-full px-8 mt-24">
           <button 
            onClick={() => navigate('/login')}
            className="w-full bg-[#2d5d39] text-white py-3 rounded-md text-lg font-medium hover:bg-[#244a2d] transition-colors shadow-md"
           >
               确定
           </button>
       </div>
    </div>
  );
};

export default ForgotPassword;
