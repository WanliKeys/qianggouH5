
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Wallet, CreditCard, ShoppingBag, MessageSquare, 
  MapPin, Ticket, QrCode, Share2, Grid, Package, 
  Gavel, ChevronRight, CircleDollarSign, Coins, ArrowRightLeft, ChevronLeft 
} from 'lucide-react';
import EmptyState from '../components/EmptyState';
import { api } from '../api';
import type { ApiProfile } from '../types';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ApiProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setLoading(false);
      setError('未登录');
      return;
    }

    api.fetchProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || '请先登录');
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
      localStorage.removeItem('authToken');
      setProfile(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!profile || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-20 relative">
        {/* Removed back button in empty state for Profile page as it is a main tab */}
        <EmptyState
            type="order"
            message="您尚未登录，请先点击登录"
        />
        <button
            onClick={() => navigate('/login')}
            className="w-48 py-2 border border-gray-300 bg-white rounded shadow-sm text-gray-700 mt-4"
        >
            去登录
        </button>
      </div>
    );
  }

  const { user, stats } = profile;
  const avatar = 'https://picsum.photos/id/64/200/200';

  const TransactionGrid = ({ title, items }: { title: string, items: any[] }) => (
    <div className="mx-4 mt-3 bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-gray-800 text-sm mb-4 font-medium">{title}</h3>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item, idx) => (
          <button key={idx} onClick={item.action} className="flex flex-col items-center justify-center">
            <div className="mb-2 p-1">
               {/* Using a darker green/custom color to match screenshot icons */}
               <item.icon size={28} className="text-green-700" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-gray-600">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const MenuItem = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full mx-auto mb-3 bg-white rounded-lg p-4 flex items-center justify-between shadow-sm active:bg-gray-50 transition-colors"
      style={{ width: 'calc(100% - 2rem)', marginLeft: '1rem', marginRight: '1rem' }}
    >
      <div className="flex items-center">
        <Icon size={20} className="text-gray-600 mr-3" />
        <span className="text-sm text-gray-700">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-400" />
    </button>
  );

  const buyerActions = [
    { label: '我的仓库', icon: Package, action: () => navigate('/warehouse?tab=warehouse') },
    { label: '确认付款', icon: Wallet, action: () => navigate('/warehouse?tab=payment') },
    { label: '确认收货', icon: CircleDollarSign, action: () => navigate('/warehouse?tab=receipt') },
    { label: '已完成', icon: Gavel, action: () => navigate('/warehouse?tab=shipping') },
  ];

  // Updated seller actions to link to specific tabs in Warehouse
  const sellerActions = [
    { label: '我的仓库', icon: Package, action: () => navigate('/warehouse?tab=warehouse') },
    { label: '确认付款', icon: Wallet, action: () => navigate('/warehouse?tab=payment') },
    { label: '确认收货', icon: CircleDollarSign, action: () => navigate('/warehouse?tab=receipt') },
    { label: '已完成', icon: Gavel, action: () => navigate('/warehouse?tab=shipping') },
  ];

  return (
    <div className="bg-gray-100 min-h-full pb-6">
      {/* Header Section */}
      <div className="bg-white pb-16 relative overflow-hidden">
        {/* Decorative Background Curve */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-white to-gray-100" style={{borderBottomLeftRadius: '50% 20%', borderBottomRightRadius: '50% 20%'}}></div>
        
        {/* Actions */}
        {/* Removed back button here */}
        <div className="absolute top-0 right-0 p-4 z-20">
             <button onClick={() => navigate('/settings')}><Settings className="text-gray-600" size={20}/></button>
        </div>

        <div className="relative pt-12 px-6 flex items-center z-10">
            <div className="w-16 h-16 rounded-full border-2 border-green-700 overflow-hidden mr-4">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-800">{user.nickname}</h2>
                <p className="text-gray-500 text-sm mt-1">{user.phone}</p>
            </div>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mx-4 -mt-10 bg-white rounded-lg shadow-sm p-4 relative z-10">
         <div className="flex justify-between items-center text-center">
             <button onClick={() => navigate('/commission')} className="flex-1 border-r border-gray-100">
                 <div className="text-gray-500 text-sm mb-1 font-medium">权益券</div>
                 <div className="text-red-500 font-bold text-lg">{stats.couponsBalance.toFixed(2)}</div>
             </button>
             <button onClick={() => navigate('/transfer')} className="flex-1">
                 <div className="text-gray-500 text-sm mb-1 font-medium">今日抢单</div>
                 <div className="text-red-500 font-bold text-lg">{stats.todayOrders.toFixed(0)}</div>
             </button>
         </div>
         {!user.isMainAccount && (
           <div className="mt-3 text-center text-xs text-gray-500">
             今日剩余次数：{stats.remainingQuota ?? 0}
           </div>
         )}
      </div>

      {/* Order Status Section */}
      <div className="mx-4 mt-4 bg-green-800 rounded-lg text-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-green-700">
              <div className="flex items-center text-sm font-medium">
                  <span className="mr-2">☆</span> 商品收藏
              </div>
              <div className="text-sm font-medium">商品评价</div>
          </div>
          <div className="flex justify-between items-center py-4 px-2">
              {[
                  { label: '待付款', icon: Wallet, path: '/orders?status=pay' },
                  { label: '待发货', icon: ShoppingBag, path: '/orders?status=ship' },
                  { label: '待收货', icon: CreditCard, path: '/orders?status=receive' },
                  { label: '待评论', icon: MessageSquare, path: '/orders?status=comment' },
                  { label: '我的订单', icon: Grid, path: '/orders' },
              ].map((item, idx) => (
                  <button key={idx} onClick={() => navigate(item.path)} className="flex flex-col items-center flex-1">
                      <item.icon size={22} className="mb-2 opacity-90"/>
                      <span className="text-xs opacity-90">{item.label}</span>
                  </button>
              ))}
          </div>
      </div>

      {/* Buyer Section */}
      <TransactionGrid title="买方" items={buyerActions} />

      {/* Seller Section */}
      <TransactionGrid title="卖方" items={sellerActions} />

      {/* Menu List */}
      <div className="mt-4 pb-20">
        <MenuItem icon={MapPin} label="我的地址" onClick={() => navigate('/address')} />
        <MenuItem icon={Ticket} label="我的优惠券" onClick={() => navigate('/coupons')} />
        <MenuItem icon={QrCode} label="我的邀请二维码" onClick={() => navigate('/invite')} />
        
        <MenuItem icon={Share2} label="分销中心" onClick={() => navigate('/distribution')} />
        <MenuItem icon={CreditCard} label="收款管理" onClick={() => navigate('/payment-methods')} />
        <MenuItem icon={Coins} label="我的收益" onClick={() => navigate('/earnings')} />
        <MenuItem icon={ArrowRightLeft} label="积分转让" onClick={() => navigate('/transfer')} />
      </div>
    </div>
  );
};

export default Profile;
