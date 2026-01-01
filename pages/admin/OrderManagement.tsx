import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable, { Column } from '../../components/admin/DataTable';
import { api } from '../../api';

interface Order {
  id: string;
  userId: string;
  productId: string;
  price: number;
  listingPrice: number;
  listingFee: number;
  commissionFee: number;
  platformServiceFee: number;
  memberProfit: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  user?: {
    id: string;
    phone: string;
    nickname: string;
    isMainAccount?: boolean;
  };
}

const OrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [splitForm, setSplitForm] = useState({ orderId: '', parts: '2' });
  const [assignForm, setAssignForm] = useState({ orderId: '', assignee: '' });
  const [addForm, setAddForm] = useState({ userId: '', productId: '', note: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const data = await api.adminFetchOrders();
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || '加载失败');
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    setNotice('');
    setError('');
    try {
      const res = await api.adminMarkPaid({ orderId });
      setNotice(res.message);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || '操作失败');
    }
  };

  const handleSplit = async () => {
    setNotice('');
    setError('');
    try {
      const res = await api.adminSplitOrder({
        orderId: splitForm.orderId,
        parts: Number(splitForm.parts || 1)
      });
      setNotice(res.message);
      setSplitForm({ orderId: '', parts: '2' });
      fetchOrders();
    } catch (err: any) {
      setError(err.message || '拆单失败');
    }
  };

  const handleAssign = async () => {
    setNotice('');
    setError('');
    try {
      const res = await api.adminAssignOrder(assignForm);
      setNotice(res.message);
      setAssignForm({ orderId: '', assignee: '' });
      fetchOrders();
    } catch (err: any) {
      setError(err.message || '配单失败');
    }
  };

  const handleAddOrder = async () => {
    setNotice('');
    setError('');
    try {
      const res = await api.adminAddOrder(addForm);
      setNotice(res.message);
      setAddForm({ userId: '', productId: '', note: '' });
      fetchOrders();
    } catch (err: any) {
      setError(err.message || '加单失败');
    }
  };

  const orderColumns: Column[] = [
    {
      key: 'id',
      label: '订单号',
      width: '12%',
      render: (value) => value.slice(-8)
    },
    {
      key: 'user',
      label: '会员信息',
      width: '18%',
      render: (user) => (
        <div>
          <div className="font-medium">{user?.nickname || '--'}</div>
          <div className="text-xs text-slate-500">{user?.phone || '--'}</div>
          {user?.isMainAccount && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded">
              主账号
            </span>
          )}
        </div>
      )
    },
    {
      key: 'price',
      label: '抢单价',
      width: '10%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'listingPrice',
      label: '上架价',
      width: '10%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'memberProfit',
      label: '会员利润',
      width: '10%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'platformServiceFee',
      label: '平台服务费',
      width: '10%',
      render: (value) => `¥${value.toFixed(2)}`
    },
    {
      key: 'status',
      label: '状态',
      width: '10%',
      render: (value) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          pending_pay: { text: '待付款', color: 'yellow' },
          pending_ship: { text: '待发货', color: 'blue' },
          pending_receive: { text: '待收货', color: 'purple' },
          completed: { text: '已完成', color: 'green' }
        };
        const status = statusMap[value] || { text: value, color: 'slate' };
        return (
          <span className={`inline-block px-2 py-1 bg-${status.color}-100 text-${status.color}-700 text-xs rounded`}>
            {status.text}
          </span>
        );
      }
    },
    {
      key: 'createdAt',
      label: '创建时间',
      width: '12%',
      render: (value) => value.slice(0, 16).replace('T', ' ')
    },
    {
      key: 'actions',
      label: '操作',
      width: '8%',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleMarkPaid(row.id);
          }}
          className="px-3 py-1 bg-green-700 text-white text-xs rounded hover:bg-green-800"
        >
          确认收款
        </button>
      )
    }
  ];

  return (
    <AdminLayout title="订单管理">
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

      {/* 订单列表 */}
      <div className="mb-6">
        <DataTable columns={orderColumns} data={orders} emptyText="暂无订单" />
      </div>

      {/* 操作面板 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 拆单 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-medium text-slate-800 mb-4">拆单</h3>
          <div className="space-y-3">
            <input
              value={splitForm.orderId}
              onChange={(e) => setSplitForm((prev) => ({ ...prev, orderId: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="订单ID"
            />
            <input
              value={splitForm.parts}
              onChange={(e) => setSplitForm((prev) => ({ ...prev, parts: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="拆分份数"
              type="number"
            />
            <button
              onClick={handleSplit}
              className="w-full bg-slate-800 text-white text-sm py-2 rounded hover:bg-slate-900"
            >
              提交拆单
            </button>
          </div>
        </div>

        {/* 配单 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-medium text-slate-800 mb-4">配单</h3>
          <div className="space-y-3">
            <input
              value={assignForm.orderId}
              onChange={(e) => setAssignForm((prev) => ({ ...prev, orderId: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="订单ID"
            />
            <input
              value={assignForm.assignee}
              onChange={(e) => setAssignForm((prev) => ({ ...prev, assignee: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="配单给(账号/备注)"
            />
            <button
              onClick={handleAssign}
              className="w-full bg-slate-800 text-white text-sm py-2 rounded hover:bg-slate-900"
            >
              提交配单
            </button>
          </div>
        </div>

        {/* 加单 */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-base font-medium text-slate-800 mb-4">加单</h3>
          <div className="space-y-3">
            <input
              value={addForm.userId}
              onChange={(e) => setAddForm((prev) => ({ ...prev, userId: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="用户ID"
            />
            <input
              value={addForm.productId}
              onChange={(e) => setAddForm((prev) => ({ ...prev, productId: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="商品ID"
            />
            <input
              value={addForm.note}
              onChange={(e) => setAddForm((prev) => ({ ...prev, note: e.target.value }))}
              className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="备注(可选)"
            />
            <button
              onClick={handleAddOrder}
              className="w-full bg-slate-800 text-white text-sm py-2 rounded hover:bg-slate-900"
            >
              提交加单
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderManagement;
