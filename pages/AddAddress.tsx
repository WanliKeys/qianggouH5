
import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

const AddAddress: React.FC = () => {
  const navigate = useNavigate();
  const [isDefault, setIsDefault] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    region: '',
    detail: ''
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name || !form.phone || !form.region || !form.detail) {
      setError('请完整填写收货信息');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await api.addAddress({ ...form, isDefault });
      navigate('/address');
    } catch (err: any) {
      setError(err.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header title="添加地址" />
      
      <div className="bg-white mt-2 px-4">
          {[
              { key: 'name', label: '收货人', placeholder: '' },
              { key: 'phone', label: '手机号码', placeholder: '' },
              { key: 'region', label: '所在地址', placeholder: '' },
              { key: 'detail', label: '详细地址', placeholder: '' },
          ].map((field) => (
            <div key={field.key} className="flex items-center py-4 border-b border-gray-100 last:border-none">
                <span className="w-24 text-gray-600">{field.label}</span>
                <input 
                    type="text" 
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="flex-1 outline-none text-gray-800 bg-transparent shadow-none appearance-none" 
                    placeholder={field.placeholder} 
                />
            </div>
          ))}
      </div>

      <div className="bg-white mt-4 px-4 py-4 flex items-center justify-between">
          <div>
              <div className="text-gray-800">默认地址</div>
              <div className="text-xs text-gray-400 mt-1">提示：每次下单都会推荐默认地址</div>
          </div>
          <button 
            onClick={() => setIsDefault(!isDefault)}
            className={`w-12 h-7 rounded-full relative transition-colors ${isDefault ? 'bg-[#4cd964]' : 'bg-gray-300'}`}
          >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${isDefault ? 'left-[22px]' : 'left-0.5'}`}></div>
          </button>
      </div>

       <div className="fixed bottom-8 left-0 right-0 px-8 flex justify-center w-full max-w-[480px] mx-auto">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`w-full py-3 rounded-full font-medium shadow-lg ${saving ? 'bg-gray-300 text-gray-600' : 'bg-green-800 text-white'}`}
          >
              {saving ? '保存中...' : '保存'}
          </button>
       </div>
       {error && <div className="mt-6 text-center text-xs text-red-500">{error}</div>}
    </div>
  );
};

export default AddAddress;
