
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { MapPin, ChevronRight } from 'lucide-react';
import { api } from '../api';
import type { ApiAddress, ApiFlashSaleItem } from '../types';

const ConfirmOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listingId = (location.state as { listingId?: string } | null)?.listingId;
  const [usePoints, setUsePoints] = useState(false);
  const [product, setProduct] = useState<ApiFlashSaleItem | null>(null);
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (!listingId) {
      setError('缺少商品信息');
    } else {
      api.fetchFlashListing({ listingId })
        .then((data) => {
          if (!mounted) return;
          setProduct(data.listing || null);
        })
        .catch((err) => {
          if (mounted) setError(err.message || '加载失败');
        });
    }
    api.fetchAddresses()
      .then((data) => {
        if (mounted) setAddresses(data.addresses);
      })
      .catch(() => {
        if (mounted) setAddresses([]);
      });
    return () => {
      mounted = false;
    };
  }, [listingId]);

  const defaultAddress = useMemo(
    () => addresses.find((addr) => addr.isDefault) || addresses[0],
    [addresses]
  );

  const handleSubmit = async () => {
    if (!product) return;
    if (product.soldOut) {
      setError('该商品已售罄');
      return;
    }
    if (!defaultAddress) {
      setError('请先填写收货地址');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await api.createFlashOrder({
        listingId: product.listingId,
        note,
        usePoints
      });
      alert(res.message);
      navigate('/orders');
    } catch (err: any) {
      setError(err.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-20">
      <Header title="确认订单" bgClass="bg-white" />
      
      {/* Address Card */}
      <button
        onClick={() => navigate('/address')}
        className="mx-3 mt-3 bg-white rounded-xl p-4 flex items-center shadow-sm w-[calc(100%-1.5rem)] text-left"
      >
        <div className="w-10 h-10 rounded-full bg-[#4cd964] flex items-center justify-center flex-shrink-0 mr-3">
            <MapPin className="text-white" size={20} fill="currentColor" />
        </div>
        <div className="flex-1 overflow-hidden">
            <div className="flex items-center mb-1">
                <span className="text-gray-900 font-bold text-lg mr-2">{defaultAddress?.name || '未填写'}</span>
                <span className="text-gray-500 text-sm">{defaultAddress?.phone || ''}</span>
            </div>
            <div className="text-gray-800 text-sm truncate">
                {defaultAddress ? `${defaultAddress.region}${defaultAddress.detail}` : '请先设置收货地址'}
            </div>
        </div>
        <ChevronRight className="text-gray-300 ml-2" size={20} />
      </button>

      {/* Product Card */}
      <div className="mx-3 mt-3 bg-white rounded-xl p-4 shadow-sm">
          {/* Product Row */}
          <div className="flex mb-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-3 border border-gray-100">
                  {product && <img src={product.image} alt="Product" className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 py-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                      <span className="text-gray-900 font-bold text-lg">{product?.title || '加载中'}</span>
                  </div>
                  <div className="text-[#e05e38] font-medium text-lg">
                      ¥ {product ? product.price.toFixed(2) : '--'}
                  </div>
              </div>
          </div>

          {/* Notes Row */}
          <div className="flex items-center py-2 mb-2">
              <span className="text-gray-900 text-base font-medium w-24">订单备注</span>
              <input 
                type="text" 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="请添加备注!" 
                className="flex-1 outline-none text-base text-gray-700 placeholder-gray-400"
              />
          </div>

          {/* Points Row */}
          <div className="flex items-center py-2">
              <span className="text-gray-900 text-base font-medium w-24">是否使用积分</span>
              <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setUsePoints(true)}
                    className={`w-12 py-1 rounded text-sm border ${usePoints ? 'border-[#4cd964] text-[#4cd964]' : 'border-gray-300 text-gray-400'}`}
                  >
                      是
                  </button>
                  <button 
                    onClick={() => setUsePoints(false)}
                    className={`w-12 py-1 rounded text-sm border ${!usePoints ? 'border-[#4cd964] text-[#4cd964]' : 'border-gray-300 text-gray-400'}`}
                  >
                      否
                  </button>
              </div>
          </div>
      </div>

      {error && (
        <div className="mx-3 mt-3 bg-white rounded-xl p-3 text-sm text-red-500 shadow-sm">
          {error}
        </div>
      )}

      {/* Footer Button */}
      <div className="fixed bottom-8 left-0 right-0 px-8 w-full max-w-[480px] mx-auto z-30">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`w-full py-3.5 rounded-full text-lg font-medium shadow-lg transition-transform ${submitting ? 'bg-gray-400' : 'bg-[#4e8d5e] active:scale-[0.98] text-white'}`}
          >
              {submitting ? '提交中...' : '提交抢单'}
          </button>
      </div>
    </div>
  );
};

export default ConfirmOrder;
