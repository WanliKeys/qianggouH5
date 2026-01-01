import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../api';
import { Clock } from 'lucide-react';

const SystemSettings: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [timeConfig, setTimeConfig] = useState({
    listingStart: '10:00',
    flashSaleStart: '10:30'
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchConfig();
  }, [navigate]);

  const fetchConfig = async () => {
    try {
      const data = await api.adminFetchConfig();
      setTimeConfig({
        listingStart: data.config.listing_start,
        flashSaleStart: data.config.flash_sale_start
      });
    } catch (err: any) {
      setError(err.message || '加载配置失败');
    }
  };

  const handleUpdateTimeConfig = async () => {
    setNotice('');
    setError('');

    // 验证时间格式
    const timePattern = /^\d{2}:\d{2}$/;
    if (!timePattern.test(timeConfig.listingStart) || !timePattern.test(timeConfig.flashSaleStart)) {
      setError('时间格式应为 HH:MM');
      return;
    }

    try {
      const res = await api.adminUpdateConfig({
        listingStart: timeConfig.listingStart,
        flashSaleStart: timeConfig.flashSaleStart
      });
      setNotice(res.message || '配置更新成功');
    } catch (err: any) {
      setError(err.message || '配置更新失败');
    }
  };

  return (
    <AdminLayout title="系统设置">
      {/* 提示信息 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}
      {notice && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-600 mb-4">
          {notice}
        </div>
      )}

      <div className="max-w-2xl">
        {/* 时间配置 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="text-blue-700" size={20} />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800">时间配置</h3>
              <p className="text-xs text-slate-500">设置每日上架和抢购时间</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                上架时间
              </label>
              <input
                type="time"
                value={timeConfig.listingStart}
                onChange={(e) => setTimeConfig({ ...timeConfig, listingStart: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                订单确认收款后,商品会在次日此时间自动上架
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                抢购开始时间
              </label>
              <input
                type="time"
                value={timeConfig.flashSaleStart}
                onChange={(e) => setTimeConfig({ ...timeConfig, flashSaleStart: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-slate-500 mt-1">
                每日此时间开始允许会员抢购商品
              </p>
            </div>

            <button
              onClick={handleUpdateTimeConfig}
              className="w-full bg-green-700 text-white text-sm py-2.5 rounded-lg hover:bg-green-800 font-medium"
            >
              保存时间配置
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;
