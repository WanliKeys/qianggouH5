
import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import type { ApiFlashSale, ApiProduct } from '../types';

const FlashSale: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ApiFlashSale | null>(null);
  const [error, setError] = useState('');

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

  const statusText = useMemo(() => {
    if (!data) return '抢单信息加载中';
    if (data.status === 'before_listing') return `商品将于 ${data.listingAt} 上架`;
    if (data.status === 'listing') return `商品已上架，${data.openAt} 开始抢单`;
    return '抢单进行中';
  }, [data]);

  const handleOrder = (product: ApiProduct) => {
    navigate('/confirm-order', { state: { productId: product.id } });
  };

  return (
    <div className="bg-gray-100 min-h-full pb-4">
      <Header title="限时抢购" showBack={false} />
      <div className="px-4 pt-3 text-sm text-gray-600">
        {statusText}
      </div>
      {error && (
        <div className="mx-4 mt-3 bg-white rounded-lg p-3 text-sm text-red-500 shadow-sm">
          {error}
        </div>
      )}
      <div className="p-4 grid grid-cols-2 gap-3">
         {(data?.products || []).map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm flex flex-col">
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
              disabled={data?.status !== 'flash_sale'}
              className={`text-white text-sm py-1.5 text-center transition-colors ${data?.status === 'flash_sale' ? 'bg-green-600 active:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              {data?.status === 'flash_sale' ? '马上抢' : '未开始'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlashSale;
