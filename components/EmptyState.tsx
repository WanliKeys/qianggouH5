
import React from 'react';
import { FileText, Search, ShoppingBag } from 'lucide-react';

interface EmptyStateProps {
  type: 'cart' | 'order' | 'coupon' | 'search';
  message: string;
  actionText?: string;
  onAction?: () => void;
  buttonClassName?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  type, 
  message, 
  actionText, 
  onAction,
  buttonClassName
}) => {
  const renderIcon = () => {
    switch (type) {
      case 'cart':
        return <ShoppingBag size={64} className="text-yellow-600 opacity-50" />;
      case 'search':
        return <Search size={64} className="text-gray-300" />;
      case 'coupon':
      case 'order':
      default:
        // Simulating the scroll paper icon in screenshots
        return (
          <div className="relative">
            <FileText size={64} className="text-yellow-600 opacity-50" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="bg-yellow-50 p-6 rounded-full mb-6">
        {renderIcon()}
      </div>
      <p className="text-gray-500 mb-6 text-sm">{message}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className={`px-8 py-2 rounded-md transition-colors ${
            buttonClassName || 'border border-green-700 text-green-700 hover:bg-green-50'
          }`}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
