import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  className = '',
}) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    danger: 'bg-rose-50 border-rose-200 text-rose-900',
  };

  const icons = {
    info: <Info className="h-5 w-5 text-blue-600 shrink-0" />,
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />,
    danger: <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />,
  };

  return (
    <div className={clsx('rounded-xl border p-4 flex gap-3 text-sm', styles[type], className)}>
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-opacity-90">{children}</div>
      </div>
    </div>
  );
};
