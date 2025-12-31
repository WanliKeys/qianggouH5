import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminShell from '../components/AdminShell';
import { api } from '../api';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('请输入管理员账号和密码');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const res = await api.adminLogin({ username, password });
      localStorage.setItem('adminToken', res.token);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminShell title="管理员登录">
      <div className="max-w-md bg-white rounded-lg p-6 shadow-sm mx-auto">
        <div>
          <div className="text-sm text-gray-600 mb-2">管理员账号</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            placeholder="请输入管理员账号"
          />
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-2">管理员密码</div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded px-3 py-2 text-sm"
            placeholder="请输入管理员密码"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={submitting}
          className={`w-full py-2.5 rounded text-sm font-medium ${submitting ? 'bg-gray-300 text-gray-600' : 'bg-green-700 text-white'}`}
        >
          {submitting ? '登录中...' : '登录'}
        </button>
        {error && <div className="text-xs text-red-500 text-center">{error}</div>}
      </div>
      <div className="text-center text-xs text-slate-500 mt-6">
        返回设置页可通过 H5 入口登录普通账号
      </div>
    </AdminShell>
  );
};

export default AdminLogin;
