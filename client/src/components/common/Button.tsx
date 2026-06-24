import React from 'react';
import type { ButtonProps } from '../../types';

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  children,
  className = '',
  ...props
}) => {
  // Base classes for premium buttons
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap';

  // Variant styles mapping
  const variantClasses = {
    primary: 'bg-[#e7e9ec] hover:bg-white text-[#0a0e14] shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_24px_rgba(231,233,236,0.15)] hover:-translate-y-0.5',
    secondary: 'bg-[#131a24] hover:bg-[#1a222e] text-[#1ec8b5] border border-[#1ec8b5]/20 hover:border-[#1ec8b5]/40 hover:-translate-y-0.5',
    outline: 'border border-[#222b38] bg-transparent text-[#e7e9ec] hover:border-[#9aa5b3] hover:bg-[#131a24]',
    text: 'text-[#9aa5b3] hover:text-[#1ec8b5] hover:bg-neutral-800/20 px-3 py-1.5'
  };

  // Size padding mappings
  const sizeClasses = {
    sm: 'text-xs px-3.5 py-1.8 gap-1.5',
    md: 'text-[14px] px-5 py-2.5 gap-2',
    lg: 'text-[15.5px] px-7 py-3.5 gap-2.5'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};
