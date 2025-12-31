
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  rightAction?: React.ReactNode;
  bgClass?: string;
  textClass?: string;
  onBack?: () => void;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  rightAction, 
  bgClass = 'bg-white', 
  textClass = 'text-gray-800',
  onBack,
  showBack = true
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`sticky top-0 z-40 w-full h-12 flex items-center justify-between px-4 ${bgClass}`}>
      {showBack ? (
        <button 
          onClick={handleBack} 
          className="p-1 -ml-2 rounded-full active:bg-black/10 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className={textClass} />
        </button>
      ) : (
        <div className="w-6" />
      )}
      <h1 className={`text-lg font-medium absolute left-1/2 -translate-x-1/2 ${textClass}`}>
        {title}
      </h1>
      <div className={textClass}>
        {rightAction || <div className="w-6" />}
      </div>
    </div>
  );
};

export default Header;
