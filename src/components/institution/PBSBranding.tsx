import React from 'react';
import clsx from 'clsx';
import { Award, BookOpen, Layers } from 'lucide-react';

interface PBSLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
  className?: string;
}

export const PBSLogo: React.FC<PBSLogoProps> = ({
  size = 'md',
  variant = 'light',
  showSubtitle = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={clsx('flex items-center gap-3 select-none', className)}>
      {/* Emblem Placeholder / Shield */}
      <div
        className={clsx(
          'relative flex items-center justify-center rounded-xl font-bold shadow-sm shrink-0 border',
          iconSizes[size],
          variant === 'dark'
            ? 'bg-navy-800 text-white border-navy-700'
            : 'bg-white text-navy-900 border-navy-100 shadow-sm'
        )}
      >
        <div className="flex flex-col items-center justify-center leading-none">
          <span className="text-[10px] tracking-tighter font-black text-amber-500">PBS</span>
          <span className="text-[7px] tracking-widest font-semibold opacity-80">eP</span>
        </div>
      </div>

      {/* Typography */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span
            className={clsx(
              'font-extrabold tracking-tight',
              textSizes[size],
              variant === 'dark' ? 'text-white' : 'text-navy-900'
            )}
          >
            SAPIe
          </span>
          <span className="text-[10px] px-1.5 py-0.2 font-semibold uppercase tracking-wider rounded bg-amber-500/20 text-amber-600 border border-amber-500/30">
            PBS
          </span>
        </div>
        {showSubtitle && (
          <div
            className={clsx(
              'text-[11px] font-semibold tracking-wider uppercase',
              variant === 'dark' ? 'text-navy-200' : 'text-navy-700'
            )}
          >
            Politeknik Banting Selangor
          </div>
        )}
      </div>
    </div>
  );
};
