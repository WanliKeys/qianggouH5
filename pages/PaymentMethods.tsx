
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { supabase } from '../supabaseClient';
import { api } from '../api';
import { Upload, Trash2 } from 'lucide-react';

const PaymentMethods: React.FC = () => {
  const [tab, setTab] = useState<'bank' | 'alipay' | 'wechat'>('wechat');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // 银行卡表单
  const [bankForm, setBankForm] = useState({
    name: '星辰',
    reservedPhone: '18800737877',
    cardNumber: '',
    bankName: '',
    phone: '18800737877',
    verifyCode: ''
  });

  // 支付宝表单
  const [alipayForm, setAlipayForm] = useState({
    qrCode: '',
    phone: '18800737877',
    verifyCode: ''
  });
  const [alipayPreview, setAlipayPreview] = useState('');

  // 微信表单
  const [wechatForm, setWechatForm] = useState({
    qrCode: '',
    phone: '18800737877',
    verifyCode: ''
  });
  const [wechatPreview, setWechatPreview] = useState('');

  // 图片上传处理
  const handleImageUpload = async (file: File, type: 'alipay' | 'wechat') => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('请选择图片文件');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('图片大小不能超过5MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `payment-qrcodes/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      if (type === 'alipay') {
        setAlipayForm({ ...alipayForm, qrCode: publicUrl });
        setAlipayPreview(publicUrl);
      } else {
        setWechatForm({ ...wechatForm, qrCode: publicUrl });
        setWechatPreview(publicUrl);
      }

      setNotice('二维码上传成功');
      setTimeout(() => setNotice(''), 2000);
    } catch (err: any) {
      setError(err.message || '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 保存银行卡
  const handleSaveBank = async () => {
    // TODO: 调用保存API
    setNotice('银行卡信息已保存');
    setTimeout(() => setNotice(''), 2000);
  };

  // 保存支付宝
  const handleSaveAlipay = async () => {
    if (!alipayForm.qrCode) {
      setError('请上传支付宝收款码');
      return;
    }
    // TODO: 调用保存API
    setNotice('支付宝收款码已保存');
    setTimeout(() => setNotice(''), 2000);
  };

  // 保存微信
  const handleSaveWechat = async () => {
    if (!wechatForm.qrCode) {
      setError('请上传微信收款码');
      return;
    }
    // TODO: 调用保存API
    setNotice('微信收款码已保存');
    setTimeout(() => setNotice(''), 2000);
  };

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

      {/* 提示信息 */}
      {error && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-300 rounded-lg p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      {notice && (
        <div className="mx-4 mt-4 bg-green-50 border border-green-300 rounded-lg p-3 text-sm text-green-600">
          {notice}
        </div>
      )}

      {tab === 'bank' && (
          <div className="mt-4 mx-4 bg-white rounded-lg px-4 pb-4">
              {/* 姓名 - 可编辑 */}
              <div className="flex py-4 border-b border-gray-100 items-center">
                  <span className="w-24 text-gray-600 text-base">姓名</span>
                  <input
                    className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                    value={bankForm.name}
                    onChange={(e) => setBankForm({ ...bankForm, name: e.target.value })}
                  />
              </div>

              {/* 预留手机号 - 可编辑 */}
              <div className="flex py-4 border-b border-gray-100 items-center">
                  <span className="w-24 text-gray-600 text-base shrink-0">预留手机号</span>
                  <input
                    type="tel"
                    className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                    value={bankForm.reservedPhone}
                    onChange={(e) => setBankForm({ ...bankForm, reservedPhone: e.target.value })}
                  />
              </div>

              {/* 卡号 */}
              <div className="flex py-4 border-b border-gray-100 items-center">
                  <span className="w-24 text-gray-600 text-base">卡号</span>
                  <input
                    className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                    placeholder="请输入卡号"
                    value={bankForm.cardNumber}
                    onChange={(e) => setBankForm({ ...bankForm, cardNumber: e.target.value })}
                  />
              </div>

              {/* 开户行 */}
              <div className="flex py-4 border-b border-gray-100 items-center">
                  <span className="w-24 text-gray-600 text-base">开户行</span>
                  <input
                    className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                    placeholder="请输入开户行"
                    value={bankForm.bankName}
                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                  />
              </div>

              {/* 手机号 */}
               <div className="flex py-4 border-b border-gray-100 items-center">
                    <span className="w-24 text-gray-600 text-base">手机号</span>
                    <span className="text-gray-400 text-base">{bankForm.phone}</span>
               </div>

              {/* 验证码 */}
               <div className="flex py-4 items-center justify-between">
                    <span className="w-24 text-gray-600 text-base">验证码</span>
                    <input
                      className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                      placeholder="请输入验证码"
                      value={bankForm.verifyCode}
                      onChange={(e) => setBankForm({ ...bankForm, verifyCode: e.target.value })}
                    />
                    <button className="bg-[#1e5530] text-white text-xs px-3 py-1.5 rounded shadow-none">获取验证码</button>
               </div>
          </div>
      )}

      {tab === 'alipay' && (
           <div className="flex flex-col">
               {/* 二维码上传区域 */}
               <div className="mt-4 bg-white py-8 flex flex-col items-center">
                   {alipayPreview ? (
                     <div className="relative">
                       <img src={alipayPreview} alt="支付宝收款码" className="w-48 h-48 object-cover rounded-md" />
                       <button
                         onClick={() => {
                           setAlipayPreview('');
                           setAlipayForm({ ...alipayForm, qrCode: '' });
                         }}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   ) : (
                     <label className="cursor-pointer">
                       <div className="w-32 h-32 bg-[#55a363] rounded-md flex items-center justify-center text-white text-4xl shadow-none">
                         {uploading ? '...' : '+'}
                       </div>
                       <input
                         type="file"
                         accept="image/*"
                         className="hidden"
                         disabled={uploading}
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) handleImageUpload(file, 'alipay');
                         }}
                       />
                     </label>
                   )}
                   <p className="text-xs text-gray-500 mt-4 text-center px-4">
                     支付宝收款码，上传后将无法修改，请认证上传
                   </p>
               </div>

                {/* 表单区域 */}
                <div className="mt-4 bg-white px-4">
                    <div className="flex py-4 border-b border-gray-100 items-center">
                        <span className="w-24 text-gray-800 text-base">手机号</span>
                        <span className="text-gray-500 text-base">{alipayForm.phone}</span>
                    </div>
                    <div className="flex py-4 items-center justify-between">
                        <span className="w-24 text-gray-800 text-base">验证码</span>
                        <input
                          className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none"
                          placeholder="请输入验证码"
                          value={alipayForm.verifyCode}
                          onChange={(e) => setAlipayForm({ ...alipayForm, verifyCode: e.target.value })}
                        />
                        <button className="bg-[#1e5530] text-white text-sm px-4 py-1.5 rounded shadow-none">获取验证码</button>
                    </div>
                </div>
           </div>
      )}

      {tab === 'wechat' && (
           <div className="flex flex-col">
               {/* 二维码上传区域 */}
               <div className="mt-4 bg-white py-8 flex flex-col items-center">
                   {wechatPreview ? (
                     <div className="relative">
                       <img src={wechatPreview} alt="微信收款码" className="w-48 h-48 object-cover rounded-md" />
                       <button
                         onClick={() => {
                           setWechatPreview('');
                           setWechatForm({ ...wechatForm, qrCode: '' });
                         }}
                         className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                       >
                         <Trash2 size={16} />
                       </button>
                     </div>
                   ) : (
                     <label className="cursor-pointer">
                       <div className="w-32 h-32 bg-[#55a363] rounded-md flex items-center justify-center text-white text-4xl shadow-none">
                         {uploading ? '...' : '+'}
                       </div>
                       <input
                         type="file"
                         accept="image/*"
                         className="hidden"
                         disabled={uploading}
                         onChange={(e) => {
                           const file = e.target.files?.[0];
                           if (file) handleImageUpload(file, 'wechat');
                         }}
                       />
                     </label>
                   )}
                   <p className="text-xs text-gray-500 mt-4 text-center px-4">
                     微信收款码，上传后将无法修改，请认证上传
                   </p>
               </div>

                {/* 表单区域 */}
                <div className="mt-4 bg-white px-4">
                    <div className="flex py-4 border-b border-gray-100 items-center">
                        <span className="w-24 text-gray-800 text-base">手机号</span>
                        <span className="text-gray-500 text-base">{wechatForm.phone}</span>
                    </div>
                    <div className="flex py-4 items-center justify-between">
                        <span className="w-24 text-gray-800 text-base">验证码</span>
                        <input
                            className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none placeholder-gray-400"
                            placeholder="请输入验证码"
                            value={wechatForm.verifyCode}
                            onChange={(e) => setWechatForm({ ...wechatForm, verifyCode: e.target.value })}
                        />
                        <button className="bg-[#1e5530] text-white text-sm px-4 py-1.5 rounded shadow-none">
                            获取验证码
                        </button>
                    </div>
                </div>
           </div>
      )}

      <div className="mt-16 px-4">
          <button
            onClick={() => {
              if (tab === 'bank') handleSaveBank();
              else if (tab === 'alipay') handleSaveAlipay();
              else handleSaveWechat();
            }}
            disabled={uploading}
            className={`w-full py-3 rounded-lg font-medium text-lg shadow-none ${uploading ? 'bg-gray-300 text-gray-600' : 'bg-[#1e5530] text-white'}`}
          >
              {uploading ? '上传中...' : `保存${tab === 'bank' ? '银行卡' : tab === 'alipay' ? '支付宝二维码' : '微信二维码'}`}
          </button>
           <p className="text-center text-gray-400 text-xs mt-4">请您仔细阅读并理解《委托寄售协议》</p>
      </div>

    </div>
  );
};

export default PaymentMethods;
