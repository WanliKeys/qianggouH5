import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import StatCard from '../../components/admin/StatCard';
import DataTable, { Column } from '../../components/admin/DataTable';
import { api } from '../../api';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Wallet,
  TrendingUp
} from 'lucide-react';

interface DashboardStats {
  todayOrders: number;
  todaySales: number;
  totalMembers: number;
  totalCommission: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  userName: string;
  phone: string;
  productName: string;
  price: number;
  status: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todaySales: 0,
    totalMembers: 0,
    totalCommission: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      const data = await api.adminGetDashboardStats();
      setStats(data.stats);
      setRecentOrders(data.recentOrders || []);
    } catch (err: any) {
      console.error('加载仪表盘数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const orderColumns: Column[] = [
    {
      key: 'orderNumber',
      label: '订单号',
      width: '15%'
    },
    {
      key: 'userName',
      label: '会员',
      width: '15%'
    },
    {
      key: 'phone',
      label: '手机号',
      width: '15%'
    },
    {
      key: 'productName',
      label: '商品',
      width: '20%'
    },
    {
      key: 'price',
      label: '金额',
      width: '12%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: '状态',
      width: '10%',
      render: (value) => {
        const statusMap: Record<string, string> = {
          pending_pay: '待付款',
          pending_ship: '待发货',
          pending_receive: '待收货',
          completed: '已完成'
        };
        return statusMap[value] || value;
      }
    },
    {
      key: 'createdAt',
      label: '创建时间',
      width: '13%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    }
  ];

  if (loading) {
    return (
      <AdminLayout title="仪表盘">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-500">加载中...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="仪表盘">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="今日订单"
          value={stats.todayOrders}
          description={`待处理 ${stats.pendingOrders} 单`}
          icon={<ShoppingCart size={24} />}
          color="blue"
        />
        <StatCard
          label="今日销售额"
          value={`¥${stats.todaySales.toFixed(2)}`}
          description="抢单总金额"
          icon={<DollarSign size={24} />}
          color="green"
        />
        <StatCard
          label="总会员数"
          value={stats.totalMembers}
          description="已注册会员"
          icon={<Users size={24} />}
          color="purple"
        />
        <StatCard
          label="总佣金发放"
          value={`¥${stats.totalCommission.toFixed(2)}`}
          description="优惠券总额"
          icon={<Wallet size={24} />}
          color="orange"
        />
      </div>

      {/* 最新订单 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-slate-800">最新订单</h3>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-sm text-green-700 hover:text-green-800"
          >
            查看全部 →
          </button>
        </div>
        <DataTable
          columns={orderColumns}
          data={recentOrders}
          emptyText="暂无订单"
        />
      </div>

      {/* 数据提示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <TrendingUp className="text-blue-600 mt-0.5" size={20} />
          <div>
            <div className="text-sm font-medium text-blue-900">数据统计</div>
            <div className="text-xs text-blue-700 mt-1">
              今日数据会在每天 10:30 抢购开始后实时更新。商品价格每天自动上涨 5%。
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
