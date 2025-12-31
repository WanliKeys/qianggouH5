
import React, { useState } from 'react';
import Header from '../components/Header';
import { ChevronRight, Lock, UserX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AccountSecurity: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="bg-[#f9fafb] min-h-screen">
            <Header title="账户与安全" onBack={() => navigate('/settings')} />
            
            <div className="mt-3 bg-white px-4">
                 <button 
                    onClick={() => navigate('/settings/change-password')}
                    className="w-full py-4 flex justify-between items-center border-b border-gray-100"
                 >
                     <div className="flex items-center">
                        <Lock size={18} className="text-gray-500 mr-3" />
                        <span className="text-gray-600 text-base">修改密码</span>
                     </div>
                     <ChevronRight size={20} className="text-gray-300" />
                 </button>
                 <button onClick={() => setShowModal(true)} className="w-full py-4 flex justify-between items-center">
                     <div className="flex items-center">
                        <UserX size={18} className="text-gray-500 mr-3" />
                        <span className="text-gray-600 text-base">注销账户</span>
                     </div>
                     <ChevronRight size={20} className="text-gray-300" />
                 </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-8">
                    <div className="w-full max-w-xs bg-[#d4b476] p-1 rounded-xl shadow-2xl animate-[fadeIn_0.2s_ease-out]">
                         <div className="border border-dashed border-[#8b6d3f]/50 rounded-lg p-6 text-center flex flex-col items-center relative bg-[#d4b476]">
                            {/* Decorative gems/image placeholder */}
                            <div className="mb-4 relative h-24 w-full flex justify-center">
                                {/* Simulated Jewelry Group */}
                                <div className="relative">
                                     <div className="w-16 h-16 rounded-full bg-red-600 border-2 border-white shadow-lg flex items-center justify-center relative z-10">
                                         <div className="w-10 h-10 bg-white/30 rounded-full blur-[2px]"></div>
                                     </div>
                                     <div className="absolute top-0 -right-6 w-12 h-12 rounded-full bg-green-600 border-2 border-white shadow-md z-0"></div>
                                     <div className="absolute bottom-0 -left-4 w-10 h-10 rounded-full bg-purple-600 border-2 border-white shadow-md z-20"></div>
                                     <div className="absolute -top-4 left-0 w-8 h-8 rounded-full bg-yellow-400 border-2 border-white shadow-md"></div>
                                </div>
                            </div>
                            
                            <h3 className="text-[#3e2b16] font-bold text-lg mb-3 tracking-wide">温馨提示</h3>
                            <p className="text-[#3e2b16] text-xs text-justify leading-relaxed mb-6 opacity-90 px-1">
                                很遗憾,平台无法为您继续服务,感谢您一路陪伴与关注。为了您的账户安全注销账户后将会永远清除与该账户有关的所有信息,服务器不再保留。
                            </p>
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="flex-1 border border-[#3e2b16] text-[#3e2b16] py-1.5 rounded-full text-sm font-medium"
                                >
                                    取消
                                </button>
                                <button 
                                    onClick={() => { setShowModal(false); }}
                                    className="flex-1 bg-[#3e2b16] text-[#d4b476] py-1.5 rounded-full text-sm font-medium"
                                >
                                    确定
                                </button>
                            </div>
                         </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default AccountSecurity;
