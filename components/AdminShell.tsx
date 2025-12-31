import React from 'react';

const AdminShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">抢购管理后台</div>
          <div className="text-sm text-slate-500">{title}</div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
};

export default AdminShell;
