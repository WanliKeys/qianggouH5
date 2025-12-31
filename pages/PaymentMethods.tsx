
import React, { useState } from 'react';
import Header from '../components/Header';

const PaymentMethods: React.FC = () => {
  const [tab, setTab] = useState<'bank' | 'alipay' | 'wechat'>('wechat');

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      <Header title="收款管理" />
      
      {/* Tabs */}
      <div className="bg-[#1e5530] px-4 py-2 flex justify-between items-center text-sm">
          <button 
            onClick={() => setTab('bank')}
            className={`px-4 py-1.5 rounded transition-colors ${tab === 'bank' ? 'bg-white text-[#1e5530]' : 'text-white'}`}
          >
              银行卡
          </button>
          <button 
            onClick={() => setTab('alipay')}
            className={`px-4 py-1.5 rounded transition-colors ${tab === 'alipay' ? 'bg-white text-[#1e5530]' : 'text-white'}`}
          >
              支付宝
          </button>
           <button 
            onClick={() => setTab('wechat')}
            className={`px-4 py-1.5 rounded transition-colors ${tab === 'wechat' ? 'bg-white text-[#1e5530]' : 'text-white'}`}
          >
              微信收款码
          </button>
      </div>

      {tab === 'bank' && (
          <div className="mt-4 mx-4 bg-white rounded-lg px-4 pb-4">
              {[
                  { label: '姓名', value: '星辰', readOnly: true },
                  { label: '预留手机号', value: '18800737877', readOnly: true },
                  { label: '卡号', placeholder: '请输入卡号' },
                  { label: '开户行', placeholder: '请输入开户行' },
              ].map((field, idx) => (
                  <div key={idx} className="flex py-4 border-b border-gray-100 last:border-none items-center">
                      <span className="w-24 text-gray-600 text-base">{field.label}</span>
                      {field.readOnly ? (
                          <span className="text-gray-400 text-base">{field.value}</span>
                      ) : (
                          <input className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" placeholder={field.placeholder} />
                      )}
                  </div>
              ))}
               <div className="flex py-4 border-b border-gray-100 items-center">
                    <span className="w-24 text-gray-600 text-base">手机号</span>
                    <span className="text-gray-400 text-base">18800737877</span>
               </div>
               <div className="flex py-4 items-center justify-between">
                    <span className="w-24 text-gray-600 text-base">验证码</span>
                    <input className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" placeholder="请输入验证码" />
                    <button className="bg-[#1e5530] text-white text-xs px-3 py-1.5 rounded shadow-none">获取验证码</button>
               </div>
          </div>
      )}

      {tab === 'alipay' && (
           <div className="flex flex-col">
               <div className="mt-4 bg-white py-8 flex flex-col items-center">
                   <div className="w-32 h-32 bg-[#55a363] rounded-md flex items-center justify-center text-white text-4xl shadow-none">
                       +
                   </div>
                   <p className="text-xs text-gray-500 mt-4 text-center px-4">支付宝收款码，上传后将将无法修改,请认证上传</p>
               </div>

                <div className="mt-4 bg-white px-4">
                    <div className="flex py-4 border-b border-gray-100 items-center">
                        <span className="w-24 text-gray-800 text-base">手机号</span>
                        <span className="text-gray-500 text-base">18800737877</span>
                    </div>
                    <div className="flex py-4 items-center justify-between">
                        <span className="w-24 text-gray-800 text-base">验证码</span>
                        <input className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" placeholder="请输入验证码" />
                        <button className="bg-[#1e5530] text-white text-sm px-4 py-1.5 rounded shadow-none">获取验证码</button>
                    </div>
                </div>
           </div>
      )}

      {tab === 'wechat' && (
           <div className="flex flex-col">
               {/* Upload Area */}
               <div className="mt-4 bg-white py-8 flex flex-col items-center">
                   <div className="w-32 h-32 bg-[#55a363] rounded-md flex items-center justify-center text-white text-4xl shadow-none">
                       +
                   </div>
                   <p className="text-xs text-gray-500 mt-4 text-center px-4">微信收款码,上传后将将无法修改,请认证上传</p>
               </div>

                {/* Form Area */}
                <div className="mt-4 bg-white px-4">
                    <div className="flex py-4 border-b border-gray-100 items-center">
                        <span className="w-24 text-gray-800 text-base">手机号</span>
                        <span className="text-gray-500 text-base">18800737877</span>
                    </div>
                    <div className="flex py-4 items-center justify-between">
                        <span className="w-24 text-gray-800 text-base">验证码</span>
                        <input 
                            className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none placeholder-gray-400" 
                            placeholder="请输入验证码" 
                        />
                        <button className="bg-[#1e5530] text-white text-sm px-4 py-1.5 rounded shadow-none">
                            获取验证码
                        </button>
                    </div>
                </div>
           </div>
      )}

      <div className="mt-16 px-4">
          <button className="w-full bg-[#1e5530] text-white py-3 rounded-lg font-medium text-lg shadow-none">
              保存{tab === 'bank' ? '银行卡' : tab === 'alipay' ? '支付宝二维码' : '微信二维码'}
          </button>
           <p className="text-center text-gray-400 text-xs mt-4">请您仔细阅读并理解《委托寄售协议》</p>
      </div>

    </div>
  );
};

export default PaymentMethods;
