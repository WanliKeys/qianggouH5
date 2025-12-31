import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  description,
  icon,
  color = 'slate'
}) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm text-slate-500">{label}</div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{value}</div>
          {description && (
            <div className="text-xs text-slate-400 mt-1">{description}</div>
          )}
        </div>
        {icon && (
          <div className={`w-12 h-12 bg-${color}-100 rounded-lg flex items-center justify-center text-${color}-600`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
