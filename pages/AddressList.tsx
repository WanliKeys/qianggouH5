
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Edit2 } from 'lucide-react';
import { api } from '../api';
import type { ApiAddress } from '../types';

const AddressList: React.FC = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<ApiAddress[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.fetchAddresses()
      .then((data) => setAddresses(data.addresses))
      .catch((err) => setError(err.message || '加载失败'));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="我的地址" onBack={() => navigate('/profile')} />
      
      <div className="p-4 space-y-3">
          {error && (
            <div className="bg-white p-4 rounded-lg text-sm text-red-500 shadow-sm">
              {error}
            </div>
          )}
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white p-4 rounded-lg flex items-center justify-between shadow-sm">
                <div className="flex-1">
                    <div className="flex items-center mb-2">
                        {addr.isDefault && <span className="bg-yellow-600 text-white text-xs px-1 rounded mr-2">默认</span>}
                        <span className="font-bold text-gray-800 mr-2">{addr.name}</span>
                        <span className="text-gray-600 font-medium">{addr.phone}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        {addr.region}
                    </div>
                    <div className="text-gray-800 font-medium text-sm mt-1">
                        {addr.detail}
                    </div>
                </div>
                <button 
                  className="p-2"
                  onClick={() => navigate(`/address/edit/${addr.id}`)}
                >
                    <Edit2 size={18} className="text-green-600" />
                </button>
            </div>
          ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white md:relative">
          <button 
            onClick={() => navigate('/address/add')}
            className="w-full bg-green-800 text-white py-3 rounded-md font-medium"
          >
              新增地址
          </button>
      </div>
    </div>
  );
};

export default AddressList;
