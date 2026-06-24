import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon, AlertCircleIcon } from './Icons';
import type { InputProps } from '../../types';
import '../../styles/form.css';

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  type = 'text',
  className = '',
  id,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="auth-form-field">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label} {required && <span className="text-[#e0596b]">*</span>}
        </label>
      )}
      <div className="auth-field-relative">
        {icon && (
          <div className="absolute left-[13px] top-1/2 -translate-y-1/2 flex items-center justify-center text-[#5e6a7a] pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={inputType}
          id={id}
          required={required}
          className={`input-field ${icon ? 'input-field-icon-pad' : ''} ${isPassword ? 'pr-[40px]' : ''
            } ${error ? 'border-[#e0596b] focus:border-[#e0596b] focus:shadow-[0_0_0_1px_rgba(224,89,107,0.4)]' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="auth-field-btn h-full flex items-center pr-1"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon size={16} className="text-[#5e6a7a] hover:text-[#9aa5b3] transition-colors" />
            ) : (
              <EyeIcon size={16} className="text-[#5e6a7a] hover:text-[#9aa5b3] transition-colors" />
            )}
          </button>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5 text-xs text-[#e0596b] animate-[fadeIn_0.2s_ease]">
          <AlertCircleIcon size={13} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
