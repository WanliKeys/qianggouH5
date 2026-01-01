import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../api';
import type { ApiProfile } from '../types';

const InviteQR: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ApiProfile | null>(null);

  useEffect(() => {
    api.fetchProfile().then(setProfile).catch(() => setProfile(null));
  }, []);

  // 生成注册链接,包含邀请码
  const inviteUrl = profile?.user.inviteCode
    ? `${window.location.origin}/#/register?inviteCode=${profile.user.inviteCode}`
    : '';

  const avatar = 'https://picsum.photos/id/64/200/200';
  return (
    <div className="bg-black min-h-screen relative flex flex-col items-center justify-center">
      {/* Background Image Simulation */}
      <img src="https://picsum.photos/id/10/800/1200" alt="bg" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 text-white z-20">
          <ChevronLeft size={28} />
      </button>

      {/* Profile Overlay */}
      <div className="relative z-10 flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mb-2">
               <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-medium">{profile?.user.nickname || '未登录'}</span>
      </div>

      {/* QR Card */}
      <div className="bg-white p-6 rounded-lg shadow-2xl relative z-10 w-72 flex flex-col items-center">
          <div className="w-48 h-48 bg-white p-2 mb-4 flex items-center justify-center">
              {inviteUrl ? (
                <QRCodeSVG
                  value={inviteUrl}
                  size={176}
                  level="H"
                  includeMargin={false}
                />
              ) : (
                <div className="text-gray-400 text-sm text-center">
                  加载中...
                </div>
              )}
          </div>
          <div className="text-gray-800 font-bold mb-2">邀请码: {profile?.user.inviteCode || '--'}</div>
          <div className="text-gray-400 text-xs text-center">扫一扫上方二维码加入我们吧</div>
      </div>
    </div>
  );
};

export default InviteQR;
