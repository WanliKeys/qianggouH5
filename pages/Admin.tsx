import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../components/AdminShell';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeMenu, setActiveMenu] = useState<'orders' | 'config' | 'split' | 'assign' | 'add'>('orders');
  const [splitForm, setSplitForm] = useState({ orderId: '', parts: '2' });
  const [assignForm, setAssignForm] = useState({ orderId: '', assignee: '' });
  const [addForm, setAddForm] = useState({ userId: '', productId: '', note: '' });
  const [configForm, setConfigForm] = useState({ listingStart: '10:00', flashSaleStart: '10:30' });

  const fetchOrders = () => {
    api.adminFetchOrders()
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message || '加载失败'));
  };

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchOrders();
    api.adminFetchConfig()
      .then((data) => setConfigForm(data.config))
      .catch(() => null);
  }, []);

  const handleMarkPaid = async (orderId: string) => {
    setNotice('');
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
    if (!splitForm.orderId || !splitForm.parts) {
      setError('请输入订单ID和拆分份数');
      return;
    }
    try {
      const res = await api.adminSplitOrder({
        orderId: splitForm.orderId,
        parts: Number(splitForm.parts || 1)
      });
      setNotice(res.message);
      fetchOrders();
      setSplitForm({ orderId: '', parts: '2' });
    } catch (err: any) {
      setError(err.message || '拆单失败');
    }
  };

  const handleAssign = async () => {
    setNotice('');
    if (!assignForm.orderId || !assignForm.assignee) {
      setError('请输入订单ID和配单对象');
      return;
    }
    try {
      const res = await api.adminAssignOrder(assignForm);
      setNotice(res.message);
      fetchOrders();
      setAssignForm({ orderId: '', assignee: '' });
    } catch (err: any) {
      setError(err.message || '配单失败');
    }
  };

  const handleAddOrder = async () => {
    setNotice('');
    if (!addForm.userId || !addForm.productId) {
      setError('请输入用户ID和商品ID');
      return;
    }
    try {
      const res = await api.adminAddOrder(addForm);
      setNotice(res.message);
      fetchOrders();
      setAddForm({ userId: '', productId: '', note: '' });
    } catch (err: any) {
      setError(err.message || '加单失败');
    }
  };

  const handleUpdateConfig = async () => {
    setNotice('');
    try {
      const res = await api.adminUpdateConfig(configForm);
      setNotice(res.message);
    } catch (err: any) {
      setError(err.message || '配置更新失败');
    }
  };

  return (
    <AdminShell title="后台管理">
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-slate-500">后台操作仅限管理员</div>
        <button
          onClick={() => {
            localStorage.removeItem('adminToken');
            navigate('/admin/login');
          }}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          退出登录
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white rounded-lg p-4 shadow-sm h-fit">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-4">菜单</div>
          <nav className="space-y-2 text-sm">
            {[
              { label: '订单', target: 'orders' },
              { label: '上架时间', target: 'config' },
              { label: '拆单', target: 'split' },
              { label: '配单', target: 'assign' },
              { label: '加单', target: 'add' }
            ].map((item) => (
              <button
                key={item.target}
                onClick={() => setActiveMenu(item.target as typeof activeMenu)}
                className={`w-full text-left rounded px-3 py-2 ${
                  activeMenu === item.target
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div>
          {error && (
            <div className="bg-white rounded-lg p-3 text-sm text-red-500 shadow-sm mb-4">
              {error}
            </div>
          )}
          {notice && (
            <div className="bg-white rounded-lg p-3 text-sm text-green-600 shadow-sm mb-4">
              {notice}
            </div>
          )}

          {activeMenu === 'orders' && (
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-gray-800 font-medium mb-3">订单列表</div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 rounded-lg p-4">
                    <div className="text-sm text-gray-700 flex justify-between">
                      <span>订单 {order.id.slice(-6)}</span>
                      <span className="text-green-700">{order.status}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      用户：{order.user?.nickname || '--'} {order.user?.phone || ''}
                    </div>
                    {order.parentId && (
                      <div className="text-xs text-amber-600 mt-1">
                        子单 {order.splitIndex}/{order.splitTotal}
                      </div>
                    )}
                    {order.assignedTo && (
                      <div className="text-xs text-slate-500 mt-1">
                        已配单：{order.assignedTo}
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      抢单价 ¥{order.price.toFixed(2)} ｜ 上架价 ¥{order.listingPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      创建时间 {order.createdAt.slice(0, 16).replace('T', ' ')}
                    </div>
                    <button
                      onClick={() => handleMarkPaid(order.id)}
                      className="mt-3 w-full bg-green-700 text-white text-sm py-2 rounded"
                    >
                      确认收款并上架
                    </button>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="text-center text-xs text-gray-400 col-span-full">暂无订单</div>
                )}
              </div>
            </section>
          )}

          {activeMenu === 'config' && (
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-gray-800 font-medium mb-3">上架与抢单时间</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-500 mb-2">上架时间 (HH:MM)</div>
                  <input
                    value={configForm.listingStart}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, listingStart: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-2">抢单时间 (HH:MM)</div>
                  <input
                    value={configForm.flashSaleStart}
                    onChange={(e) => setConfigForm((prev) => ({ ...prev, flashSaleStart: e.target.value }))}
                    className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={handleUpdateConfig}
                className="mt-4 w-full bg-slate-800 text-white text-sm py-2 rounded"
              >
                保存时间配置
              </button>
            </section>
          )}

          {activeMenu === 'split' && (
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-gray-800 font-medium mb-3">拆单</div>
              <div className="flex items-center space-x-2">
                <input
                  value={splitForm.orderId}
                  onChange={(e) => setSplitForm((prev) => ({ ...prev, orderId: e.target.value }))}
                  className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm"
                  placeholder="订单ID"
                />
                <input
                  value={splitForm.parts}
                  onChange={(e) => setSplitForm((prev) => ({ ...prev, parts: e.target.value }))}
                  className="w-20 border border-gray-200 rounded px-3 py-2 text-sm"
                  placeholder="份数"
                />
              </div>
              <button
                onClick={handleSplit}
                className="mt-3 w-full bg-slate-800 text-white text-sm py-2 rounded"
              >
                提交拆单
              </button>
            </section>
          )}

          {activeMenu === 'assign' && (
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-gray-800 font-medium mb-3">配单</div>
              <input
                value={assignForm.orderId}
                onChange={(e) => setAssignForm((prev) => ({ ...prev, orderId: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                placeholder="订单ID"
              />
              <input
                value={assignForm.assignee}
                onChange={(e) => setAssignForm((prev) => ({ ...prev, assignee: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mt-2"
                placeholder="配单给(账号/备注)"
              />
              <button
                onClick={handleAssign}
                className="mt-3 w-full bg-slate-800 text-white text-sm py-2 rounded"
              >
                提交配单
              </button>
            </section>
          )}

          {activeMenu === 'add' && (
            <section className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-gray-800 font-medium mb-3">加单</div>
              <input
                value={addForm.userId}
                onChange={(e) => setAddForm((prev) => ({ ...prev, userId: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
                placeholder="用户ID"
              />
              <input
                value={addForm.productId}
                onChange={(e) => setAddForm((prev) => ({ ...prev, productId: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mt-2"
                placeholder="商品ID"
              />
              <input
                value={addForm.note}
                onChange={(e) => setAddForm((prev) => ({ ...prev, note: e.target.value }))}
                className="w-full border border-gray-200 rounded px-3 py-2 text-sm mt-2"
                placeholder="备注(可选)"
              />
              <button
                onClick={handleAddOrder}
                className="mt-3 w-full bg-slate-800 text-white text-sm py-2 rounded"
              >
                提交加单
              </button>
            </section>
          )}
        </div>
      </div>
    </AdminShell>
  );
};

export default Admin;
