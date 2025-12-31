import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api } from '../api';
import type { ApiProduct } from '../types';

const Home: React.FC = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    api.fetchProducts()
      .then((data) => {
        if (mounted) setProducts(data.products);
      })
      .catch((err) => {
        if (mounted) setError(err.message || '加载失败');
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-full pb-4">
      {/* Header Search */}
      <div className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center shadow-sm">
        <button className="mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <div className="flex-1 bg-gray-100 rounded-full flex items-center px-4 py-1.5">
          <Search size={16} className="text-gray-400 mr-2" />
          <input 
            type="text" 
            placeholder="请输入搜索关键词..." 
            className="bg-transparent text-sm w-full outline-none text-gray-700"
          />
        </div>
      </div>

      {/* Main Banner */}
      <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
        <img 
          src="https://picsum.photos/id/11/800/400" 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4">
          <h2 className="text-2xl font-bold text-gray-800">天然抗氧化</h2>
          <h3 className="text-xl font-light text-gray-700">细胞更年轻</h3>
        </div>
      </div>

      {/* Notice Bar */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <span className="bg-orange-300 text-white text-xs px-1 rounded mr-2">公告</span>
        <span className="text-sm text-gray-700">每日10:00上架，10:30开始抢单</span>
      </div>

      {/* Product Recommendation Header */}
      <div className="px-4 py-4 bg-white mt-2">
        <div className="flex items-center">
          <div className="w-1 h-4 bg-yellow-400 mr-2 rounded-full"></div>
          <h2 className="text-lg font-bold text-gray-900">商品推荐</h2>
        </div>
      </div>

      {/* Product Grid */}
      <div className="p-4 space-y-4">
        {error && (
          <div className="bg-white rounded-lg p-4 text-sm text-red-500 shadow-sm">
            {error}
          </div>
        )}
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
                <img 
                src={product.image} 
                alt={product.title} 
                className="w-full h-48 object-cover"
                />
                 <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full">
                  迷迭香提取物
                </div>
            </div>
            
            <div className="p-3">
              <h3 className="font-bold text-lg text-gray-800">{product.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{product.subtitle}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-gray-900 font-bold text-lg">¥ {product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
