
import React, { useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';

const EditAddress: React.FC = () => {
  const navigate = useNavigate();
  const [isDefault, setIsDefault] = useState(true);

  return (
    <div className="bg-gray-100 min-h-screen pb-20">
      <Header title="编辑地址" onBack={() => navigate('/address')} />

      <div className="bg-white mt-2 px-4">
        <div className="flex items-center py-5 border-b border-gray-100">
            <span className="w-24 text-gray-500 text-base">联系人</span>
            <input type="text" defaultValue="星辰" className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" />
        </div>
        <div className="flex items-center py-5 border-b border-gray-100">
            <span className="w-24 text-gray-500 text-base">手机号</span>
            <input type="tel" defaultValue="18800737877" className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" />
        </div>
        <div className="flex items-center py-5 border-b border-gray-100">
            <span className="w-24 text-gray-500 text-base">所在地址</span>
            <input type="text" defaultValue="河南省-洛阳市-伊川县" className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" />
        </div>
        <div className="flex items-center py-5">
            <span className="w-24 text-gray-500 text-base">详细地址</span>
            <input type="text" defaultValue="杜康大道" className="flex-1 outline-none text-gray-800 text-base bg-transparent shadow-none appearance-none" />
        </div>
      </div>

      <div className="bg-white mt-4 px-4 py-4 flex items-center justify-between">
          <div>
              <div className="text-gray-500 text-base">默认地址</div>
              <div className="text-xs text-gray-400 mt-1">提示：每次下单都会推荐默认地址</div>
          </div>
          <button 
            onClick={() => setIsDefault(!isDefault)}
            className={`w-12 h-7 rounded-full relative transition-colors ${isDefault ? 'bg-[#4cd964]' : 'bg-gray-300'}`}
          >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm absolute top-0.5 transition-all ${isDefault ? 'left-[22px]' : 'left-0.5'}`}></div>
          </button>
      </div>

      <div className="px-4 mt-6">
          <button className="text-[#3CB371] text-base font-normal">
              删除收货地址
          </button>
      </div>

      <div className="fixed bottom-8 left-0 right-0 px-4 flex justify-center w-full max-w-[480px] mx-auto">
          <button 
            onClick={() => navigate('/address')}
            className="w-full bg-[#1e5530] text-white py-3 rounded-md font-medium text-base shadow-sm hover:bg-[#164225] transition-colors"
          >
              确认
          </button>
      </div>
    </div>
  );
};

export default EditAddress;
