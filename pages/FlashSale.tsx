
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { api } from '../api';
import type { ApiFlashSale, ApiFlashSaleItem } from '../types';

const FlashSale: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ApiFlashSale | null>(null);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = () => {
      api.fetchFlashSale()
        .then((res) => {
          if (mounted) setData(res);
        })
        .catch((err) => {
          if (mounted) setError(err.message || '加载失败');
        });
    };
    fetchData();
    const timer = window.setInterval(fetchData, 30000);
    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    if (!data) return;

    const calculateCountdown = () => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];

      let targetTime: Date | null = null;

      if (data.status === 'before_listing') {
        // 距离上架时间的倒计时
        targetTime = new Date(`${today}T${data.listingAt}`);
      } else if (data.status === 'listing') {
        // 距离抢购时间的倒计时
        targetTime = new Date(`${today}T${data.openAt}`);
      }

      if (!targetTime) {
        setCountdown('');
        return;
      }

      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    calculateCountdown();
    const countdownTimer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(countdownTimer);
  }, [data]);

  const statusText = useMemo(() => {
    if (!data) return '抢单信息加载中';
    if (data.status === 'before_listing') return `商品将于 ${data.listingAt} 上架`;
    if (data.status === 'listing') return `商品已上架，${data.openAt} 开始抢单`;
    return '抢单进行中';
  }, [data]);

  const handleOrder = (item: ApiFlashSaleItem) => {
    navigate('/confirm-order', { state: { listingId: item.listingId } });
  };

  return (
    <div className="bg-gray-100 min-h-full pb-4">
      <Header title="限时抢购" showBack={false} />

      {/* 状态和倒计时区域 */}
      <div className="mx-4 mt-3 bg-gradient-to-r from-green-700 to-green-600 rounded-lg p-4 shadow-md text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={20} />
            <span className="text-sm font-medium">{statusText}</span>
          </div>
          {countdown && (
            <div className="bg-white/20 backdrop-blur-sm rounded px-3 py-1.5">
              <span className="font-mono text-lg font-bold tracking-wider">{countdown}</span>
            </div>
          )}
        </div>
        {data?.status === 'flash_sale' && (
          <div className="mt-2 text-xs opacity-90">
            🔥 抢购进行中，手慢无!
          </div>
        )}
      </div>

      {error && (
        <div className="mx-4 mt-3 bg-white rounded-lg p-3 text-sm text-red-500 shadow-sm">
          {error}
        </div>
      )}

      {/* 上架后展示商品列表（抢购阶段可点击） */}
      {(data?.status === 'listing' || data?.status === 'flash_sale') && (
        <div className="p-4 grid grid-cols-2 gap-3">
           {(data?.products || []).map((product) => (
            <div key={product.listingId} className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-2 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-gray-800 truncate">{product.title}</h3>
                  <p className="text-xs text-gray-500 mt-1 truncate">{product.subtitle}</p>
                </div>
                <div className="mt-2">
                  <span className="text-red-600 font-bold text-base">¥ {product.price.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={() => handleOrder(product)}
                disabled={data?.status !== 'flash_sale' || product.soldOut}
                className={`text-white text-sm py-1.5 text-center transition-colors ${
                  data?.status !== 'flash_sale' || product.soldOut
                    ? 'bg-gray-400'
                    : 'bg-green-600 active:bg-green-700'
                }`}
              >
                {product.soldOut ? '已售罄' : data?.status === 'flash_sale' ? '马上抢' : '未开始'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashSale;
