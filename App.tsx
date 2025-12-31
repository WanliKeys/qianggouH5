
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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

const App: React.FC = () => {
  return (
    <Router>
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
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
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
    </Router>
  );
};

export default App;
