import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { api } from '../../api';
import { Clock, Percent, DollarSign } from 'lucide-react';

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        {/* 价格配置说明 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Percent className="text-green-700" size={20} />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800">价格配置</h3>
              <p className="text-xs text-slate-500">商品价格计算规则说明</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm font-medium text-slate-700 mb-2">每日涨价规则</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                商品价格每天按固定比例上涨。默认每日涨价率为 5%,即今日价格 = 基础价格 × (1.05)^天数
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm font-medium text-slate-700 mb-2">费用计算</div>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• 上架手续费 = 上架价格 × 手续费率</li>
                <li>• 佣金 = 上架价格 × 佣金率</li>
                <li>• 平台服务费 = 上架价格 × 服务费率</li>
                <li>• 会员利润 = 上架价格 × 利润率</li>
              </ul>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm font-medium text-blue-700 mb-2">💡 提示</div>
              <p className="text-xs text-blue-600 leading-relaxed">
                费用比例和涨价率等核心参数需要在数据库 config 表中直接修改,以确保数据一致性和安全性。
              </p>
            </div>
          </div>
        </div>

        {/* 系统信息 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-purple-700" size={20} />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800">业务参数</h3>
              <p className="text-xs text-slate-500">当前系统配置参数</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">每日涨价率</span>
              <span className="text-sm font-medium text-slate-800">5%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">上架手续费率</span>
              <span className="text-sm font-medium text-slate-800">1%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">佣金费率</span>
              <span className="text-sm font-medium text-slate-800">3%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">平台服务费率</span>
              <span className="text-sm font-medium text-slate-800">2%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">会员利润率</span>
              <span className="text-sm font-medium text-slate-800">4%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">每日抢单限制</span>
              <span className="text-sm font-medium text-slate-800">3单</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-100">
              <span className="text-sm text-slate-600">推荐奖励</span>
              <span className="text-sm font-medium text-slate-800">¥10/人</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">优惠券提现门槛</span>
              <span className="text-sm font-medium text-slate-800">¥100</span>
            </div>
          </div>

          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-700">
              ⚠️ 以上参数为只读显示,如需修改请在 Supabase Dashboard 的 config 表中操作
            </p>
          </div>
        </div>

        {/* 管理员账号 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-800">管理员账号</h3>
              <p className="text-xs text-slate-500">修改管理员登录凭证</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm font-medium text-slate-700 mb-2">修改密码</div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                为了安全,管理员账号和密码存储在数据库中。如需修改,请前往 Supabase Dashboard。
              </p>
              <ol className="text-xs text-slate-600 space-y-1 list-decimal list-inside">
                <li>访问 Supabase Dashboard</li>
                <li>进入 Table Editor</li>
                <li>选择 config 表</li>
                <li>修改 admin_username 和 admin_password 字段</li>
              </ol>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs text-red-700">
                🔒 重要提示:请使用强密码,并定期更换管理员密码以保障系统安全
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SystemSettings;
