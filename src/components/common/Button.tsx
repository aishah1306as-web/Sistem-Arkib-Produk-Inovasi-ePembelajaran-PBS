import React from 'react';
import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-4 py-2 rounded-lg gap-2',
    lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
  };

  const variantClasses = {
    primary: 'bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm focus:ring-navy-500',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:bg-slate-300 focus:ring-slate-400',
    success: 'bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900 shadow-sm focus:ring-emerald-500',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 shadow-sm focus:ring-rose-500',
    outline: 'bg-white text-navy-800 border border-gray-300 hover:bg-navy-50 active:bg-navy-100 focus:ring-navy-500',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-400',
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
