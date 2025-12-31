import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Routes where the bottom nav should be visible
  const showNavRoutes = ['/', '/flash-sale', '/cart', '/profile'];
  const showNav = showNavRoutes.includes(location.pathname) && !isAdminRoute;

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-100">
        {children}
      </div>
    );
  }

  return (
    <div className="flex justify-center min-h-screen bg-gray-100">
      {/* Container to simulate mobile app on desktop */}
      <div className="w-full max-w-[480px] bg-gray-50 min-h-screen shadow-2xl relative flex flex-col">
        
        {/* Main Content Area */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${showNav ? 'pb-16' : ''}`}>
          {children}
        </div>

        {/* Bottom Navigation */}
        {showNav && <BottomNav />}
      </div>
    </div>
  );
};

export default Layout;
