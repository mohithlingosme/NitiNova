import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void | Promise<void>;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  loading?: boolean;
  disabled?: boolean;
}

const getSizeClasses = (size: string = 'md') => {
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
};

const Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', size = 'md', className = '', loading = false, disabled = false }) => {
  const baseClasses = 'rounded font-medium focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizeClasses = getSizeClasses(size);
  const variantClasses = variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500';
  const loader = loading ? 'Loading...' : children;
  
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled}
      className={`${sizeClasses} ${baseClasses} ${variantClasses} ${className}`}
    >
      {loader}
    </button>
  );
};

export default Button;
