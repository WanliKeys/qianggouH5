
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { HelpCircle, ChevronRight, Wallet, Clock, Users, FileText, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { ApiProfile } from '../types';

const Distribution: React.FC = () => {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(false);
  const [profile, setProfile] = useState<ApiProfile | null>(null);

  useEffect(() => {
    api.fetchProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen relative">
      <Header 
        title="分销中心" 
        bgClass="bg-white" 
        onBack={() => navigate('/profile')}
      />
      
      {/* Dashboard Card */}
      <div className="bg-black/90 mx-4 mt-4 rounded-lg p-6 text-yellow-600 relative overflow-hidden shadow-lg">
          <div className="flex justify-between items-start mb-6">
              <span className="text-lg font-medium">可提现佣金</span>
              <button 
                onClick={() => setShowIntro(true)}
                className="flex items-center text-xs text-gray-300 active:opacity-70 transition-opacity"
              >
                  分销说明 <HelpCircle size={14} className="ml-1" />
              </button>
          </div>
          <div className="text-center mb-8">
              <div className="text-4xl font-light">¥ {profile ? profile.stats.couponsBalance.toFixed(1) : '0.0'}</div>
          </div>
          
          <div className="flex justify-between text-center text-xs text-gray-400 border-t border-gray-700 pt-4">
              <div>
                  <div className="text-yellow-600 mb-1">¥ {profile ? profile.stats.couponsBalance.toFixed(2) : '0.00'}</div>
                  <div>累计总获得</div>
              </div>
               <div>
                  <div className="text-yellow-600 mb-1">¥ 0</div>
                  <div>今日获得</div>
              </div>
               <div>
                  <div className="text-yellow-600 mb-1">¥ 0</div>
                  <div>近7日获得</div>
              </div>
          </div>
      </div>

      {/* Menu Links */}
      <div className="bg-black/90 mx-4 mt-6 rounded-lg overflow-hidden">
          {[
              { label: '我的佣金', icon: Wallet, path: '/commission' },
              { label: '提现记录', icon: Clock, path: '/withdraw-history' },
              { label: '我的粉丝', icon: Users, path: '/fans' },
              { label: '粉丝订单', icon: FileText, path: '/fans-orders' },
          ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => navigate(item.path)}
                className="w-full flex items-center justify-between p-4 border-b border-gray-800 last:border-none hover:bg-white/5 active:bg-white/10"
              >
                  <div className="flex items-center text-gray-300">
                      <item.icon size={20} className="mr-3 text-yellow-600" />
                      <span className="text-sm">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-500" />
              </button>
          ))}
      </div>
      
      <div className="text-center text-gray-400 text-xs mt-8 pb-8">
          --我也是有底线的--
      </div>

      {/* Instructions Modal */}
      {showIntro && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
            <div className="bg-white w-full max-w-md rounded-lg p-5 relative animate-[fadeIn_0.2s_ease-out]">
                <button 
                  onClick={() => setShowIntro(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
                >
                    <X size={22} />
                </button>
                <div className="text-center text-lg text-gray-800 mb-4 font-normal">分销说明</div>
                
                <div className="text-sm text-gray-700 space-y-4 max-h-[60vh] overflow-y-auto leading-relaxed">
                    <section>
                        <h4 className="font-bold text-gray-900 mb-1">怎样邀请好友？</h4>
                        <p className="text-justify text-gray-600">
                            在我的页面找到“分销中心”点击进入找到“我的二维码”静待几秒钟，生成二维码之后，转发给想要邀请的好友进行扫码。请注意，邀请注册完成的好友务必去完善“收款管理”和“我的地址”以便快速的进行寄售服务。邀请注册成功的好友可在“分销中心-我的粉丝”中查看。
                        </p>
                    </section>
                    
                    <section>
                        <h4 className="font-bold text-gray-900 mb-1">《用户收款管理》</h4>
                        <p className="text-justify mb-2 text-gray-600">
                            用户设置收付款信息请事先准备好个人的微信收款码，支付宝收款码，以及注册用户身份信息一致的银行卡账号、银行卡的开户行信息、和银行预留手机号码。
                        </p>
                        <ul className="list-none space-y-1 text-gray-600">
                            <li>第一步：进入商城点击“我的”页面</li>
                            <li>第二步：点击“收款管理”；</li>
                            <li>第三步：依次上传微信收款码和支付宝收款码，及填写银行卡信息；(银行卡信息为必填项)</li>
                        </ul>
                        <p className="mt-1 text-gray-800 text-xs">注意：每个平台账号仅支持绑定一个银行卡信息。</p>
                    </section>

                    <section>
                         <h4 className="font-bold text-gray-900 mb-1">《用户收货地址》</h4>
                         <ul className="list-none space-y-1 text-gray-600">
                            <li>第一步：进入商城点击“我的”页面；</li>
                            <li>第二步：进入页面点击“我的地址”；</li>
                            <li>第三步：在我的地址管理页面点击“新增收货地址”；</li>
                            <li>第四步：依次填写信息后点击“保存地址”并勾选为默认地址。</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Distribution;
