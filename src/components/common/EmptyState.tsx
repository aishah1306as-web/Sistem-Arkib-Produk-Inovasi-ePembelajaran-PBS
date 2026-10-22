import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 ${className}`}>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-navy-50 text-navy-700 mb-4">
        {icon || <PackageOpen className="h-7 w-7" />}
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <div className="mt-5">
          <Button onClick={onAction} variant="primary" size="sm">
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
