
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import FlashSale from './pages/FlashSale';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AddressList from './pages/AddressList';
import AddAddress from './pages/AddAddress';
import EditAddress from './pages/EditAddress';
import OrderList from './pages/OrderList';
import Coupons from './pages/Coupons';
import InviteQR from './pages/InviteQR';
import Distribution from './pages/Distribution';
import PaymentMethods from './pages/PaymentMethods';
import Commission from './pages/Commission';
import WithdrawHistory from './pages/WithdrawHistory';
import Fans from './pages/Fans';
import FansOrders from './pages/FansOrders';
import Transfer from './pages/Transfer';
import Earnings from './pages/Earnings';
import Warehouse from './pages/Warehouse';
import Settings from './pages/Settings';
import PersonalInfo from './pages/PersonalInfo';
import AccountSecurity from './pages/AccountSecurity';
import ChangePassword from './pages/ChangePassword';
import ConfirmOrder from './pages/ConfirmOrder';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/OrderManagement';
import AdminProducts from './pages/admin/ProductManagement';
import AdminMembers from './pages/admin/MemberManagement';
import AdminCoupons from './pages/admin/CouponManagement';
import AdminSettings from './pages/admin/SystemSettings';

// ==========================================
// 维护模式开关
// 设置为 true 开启维护模式，false 关闭维护模式
// 注意：管理员后台 (/admin) 不受影响，可以正常访问
// ==========================================
const MAINTENANCE_MODE = false;

// 维护页面组件
const MaintenancePage: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '48px 32px',
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '64px',
          marginBottom: '24px'
        }}>
          🔧
        </div>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '600',
          color: '#1a202c',
          marginBottom: '16px',
          margin: '0'
        }}>
          系统维护中
        </h1>
        <p style={{
          fontSize: '16px',
          color: '#718096',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          网站正在进行系统升级和维护<br />
          预计很快恢复，敬请谅解
        </p>
        <div style={{
          fontSize: '14px',
          color: '#a0aec0',
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          如有紧急问题，请联系客服
        </div>
      </div>
    </div>
  );
};

// 路由包装器，用于检查维护模式
const AppRoutes: React.FC = () => {
  const location = useLocation();

  // 如果开启了维护模式，且不是管理员路径，则显示维护页面
  if (MAINTENANCE_MODE && !location.pathname.startsWith('/admin')) {
    return <MaintenancePage />;
  }

  return (
    <Layout>
      <Routes>
          {/* Main Tabs */}
          <Route path="/" element={<Home />} />
          <Route path="/flash-sale" element={<FlashSale />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/coupons" element={<AdminCoupons />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/settings/personal-info" element={<PersonalInfo />} />
          <Route path="/settings/security" element={<AccountSecurity />} />
          <Route path="/settings/change-password" element={<ChangePassword />} />

          {/* Address */}
          <Route path="/address" element={<AddressList />} />
          <Route path="/address/add" element={<AddAddress />} />
          <Route path="/address/edit/:id" element={<EditAddress />} />
          
          {/* Orders */}
          <Route path="/orders" element={<OrderList />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          
          {/* Tools */}
          <Route path="/coupons" element={<Coupons />} />
          <Route path="/invite" element={<InviteQR />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/earnings" element={<Earnings />} />
          
          {/* Distribution Subpages */}
          <Route path="/commission" element={<Commission />} />
          <Route path="/withdraw-history" element={<WithdrawHistory />} />
          <Route path="/fans" element={<Fans />} />
          <Route path="/fans-orders" element={<FansOrders />} />
          
          {/* Fallback for other routes showing empty orders page pattern */}
          <Route path="*" element={<OrderList />} />
        </Routes>
      </Layout>
    );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
