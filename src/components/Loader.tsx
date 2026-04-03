import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-8">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-indigo-600`} />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
};

export default Loader;

