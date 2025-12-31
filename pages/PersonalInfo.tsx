
import React from 'react';
import Header from '../components/Header';
import { MOCK_USER } from '../constants';
import { useNavigate } from 'react-router-dom';

const PersonalInfo: React.FC = () => {
  const navigate = useNavigate();
  return (
      <div className="bg-[#f9fafb] min-h-screen">
          <Header 
            title="个人资料" 
            rightAction={<button className="text-gray-500 text-sm font-medium px-2">保存</button>} 
          />
          <div className="mt-3 bg-white px-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-[#1e5530] font-medium text-base">头像</span>
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img src={MOCK_USER.avatar} alt="avatar" className="w-full h-full object-cover" />
                  </div>
              </div>
              <div className="flex justify-between items-center py-4">
                  <span className="text-[#1e5530] font-medium text-base">昵称</span>
                  <span className="text-gray-800 text-base font-medium">{MOCK_USER.nickname}</span>
              </div>
          </div>
      </div>
  )
}
export default PersonalInfo;
