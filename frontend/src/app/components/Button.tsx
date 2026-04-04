'use client';

import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
  disabled?: boolean;
}

export default function Button({ 
  children, 
  onClick, 
  loading = false, 
  variant = 'primary',
  className = '',
  disabled = false 
}: ButtonProps) {
  const base = 'px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2';
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-400',
    secondary: 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 disabled:bg-gray-100',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className} ${loading || disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}

