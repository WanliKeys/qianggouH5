import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { Column } from '../../components/admin/DataTable';
import { api } from '../../api';
import { ArrowLeft, User } from 'lucide-react';

interface Member {
  id: string;
  phone: string;
  nickname: string;
  invite_code: string;
  is_main_account: boolean;
  created_at: string;
  orderCount: number;
  couponsBalance: number;
  referralCount: number;
}

interface MemberDetail {
  user: {
    id: string;
    phone: string;
    nickname: string;
    invite_code: string;
    is_main_account: boolean;
    created_at: string;
  };
  orders: any[];
  coupons: any[];
  referrals: any[];
}

const MemberManagement: React.FC = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberDetail | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchMembers();
  }, [navigate]);

  const fetchMembers = async () => {
    try {
      const data = await api.adminGetUsers();
      setMembers(data.users);
    } catch (err: any) {
      setError(err.message || '加载失败');
    }
  };

  const handleViewMember = async (userId: string) => {
    setLoading(true);
    setError('');
    try {
      const data = await api.adminGetUserDetail({ userId });
      setSelectedMember(data);
    } catch (err: any) {
      setError(err.message || '加载会员详情失败');
    } finally {
      setLoading(false);
    }
  };

  const memberColumns: Column[] = [
    {
      key: 'id',
      label: '会员ID',
      width: '12%',
      render: (value) => value.slice(-8)
    },
    {
      key: 'nickname',
      label: '会员信息',
      width: '20%',
      render: (value, row) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-xs text-slate-500">{row.phone}</div>
          {row.is_main_account && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
              主账号
            </span>
          )}
        </div>
      )
    },
    {
      key: 'invite_code',
      label: '邀请码',
      width: '12%',
      render: (value) => (
        <span className="font-mono text-sm font-medium">{value}</span>
      )
    },
    {
      key: 'orderCount',
      label: '订单数',
      width: '10%',
      render: (value) => <span className="text-blue-700">{value}</span>
    },
    {
      key: 'couponsBalance',
      label: '优惠券余额',
      width: '12%',
      render: (value) => (
        <span className="text-green-700 font-medium">¥{value.toFixed(2)}</span>
      )
    },
    {
      key: 'referralCount',
      label: '推荐人数',
      width: '10%',
      render: (value) => <span className="text-purple-700">{value}</span>
    },
    {
      key: 'created_at',
      label: '注册时间',
      width: '14%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    },
    {
      key: 'actions',
      label: '操作',
      width: '10%',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleViewMember(row.id);
          }}
          className="px-3 py-1 bg-blue-700 text-white text-xs rounded hover:bg-blue-800"
        >
          查看详情
        </button>
      )
    }
  ];

  if (selectedMember) {
    const orderColumns: Column[] = [
      { key: 'id', label: '订单号', width: '20%', render: (v) => v.slice(-8) },
      { key: 'price', label: '金额', width: '15%', render: (v) => `¥${v.toFixed(2)}` },
      { key: 'status', label: '状态', width: '15%' },
      { key: 'created_at', label: '创建时间', width: '25%', render: (v) => v.slice(0, 16).replace('T', ' ') }
    ];

    const couponColumns: Column[] = [
      { key: 'id', label: 'ID', width: '20%', render: (v) => v.slice(-8) },
      { key: 'amount', label: '金额', width: '15%', render: (v) => `¥${v.toFixed(2)}` },
      { key: 'status', label: '状态', width: '15%' },
      { key: 'reason', label: '来源', width: '25%' },
      { key: 'created_at', label: '创建时间', width: '25%', render: (v) => v.slice(0, 16).replace('T', ' ') }
    ];

    const referralColumns: Column[] = [
      {
        key: 'referred_user',
        label: '推荐用户',
        width: '30%',
        render: (v) => (
          <div>
            <div className="font-medium">{v?.nickname || '未知'}</div>
            <div className="text-xs text-slate-500">{v?.phone || '-'}</div>
          </div>
        )
      },
      { key: 'created_at', label: '推荐时间', width: '30%', render: (v) => v.slice(0, 16).replace('T', ' ') }
    ];

    return (
      <AdminLayout title="会员管理">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
            {error}
          </div>
        )}

        <div className="mb-6">
          <button
            onClick={() => setSelectedMember(null)}
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800"
          >
            <ArrowLeft size={16} />
            返回会员列表
          </button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
              <User size={32} className="text-slate-500" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-medium">{selectedMember.user.nickname}</h3>
                {selectedMember.user.is_main_account && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                    主账号
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">手机号</div>
                  <div className="font-medium">{selectedMember.user.phone}</div>
                </div>
                <div>
                  <div className="text-slate-500">邀请码</div>
                  <div className="font-mono font-medium">{selectedMember.user.invite_code}</div>
                </div>
                <div>
                  <div className="text-slate-500">会员ID</div>
                  <div className="font-mono text-xs">{selectedMember.user.id.slice(-12)}</div>
                </div>
                <div>
                  <div className="text-slate-500">注册时间</div>
                  <div>{selectedMember.user.created_at.slice(0, 10)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">订单总数</div>
            <div className="text-2xl font-bold text-blue-700">{selectedMember.orders.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 mb-1">优惠券总额</div>
            <div className="text-2xl font-bold text-green-700">
              ¥{selectedMember.coupons.reduce((sum, c) => sum + Number(c.amount), 0).toFixed(2)}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 mb-1">推荐人数</div>
            <div className="text-2xl font-bold text-purple-700">{selectedMember.referrals.length}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-base font-medium text-slate-800 mb-3">订单记录</h4>
            <DataTable columns={orderColumns} data={selectedMember.orders} emptyText="暂无订单" />
          </div>

          <div>
            <h4 className="text-base font-medium text-slate-800 mb-3">优惠券记录</h4>
            <DataTable columns={couponColumns} data={selectedMember.coupons} emptyText="暂无优惠券" />
          </div>

          <div>
            <h4 className="text-base font-medium text-slate-800 mb-3">推荐记录</h4>
            <DataTable columns={referralColumns} data={selectedMember.referrals} emptyText="暂无推荐" />
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="会员管理">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-600 mb-4">
          加载中...
        </div>
      )}

      <div className="mb-4">
        <div className="text-sm text-slate-600">
          共 <span className="font-medium text-slate-800">{members.length}</span> 名会员
        </div>
      </div>

      <DataTable columns={memberColumns} data={members} emptyText="暂无会员" />
    </AdminLayout>
  );
};

export default MemberManagement;
