import React from 'react';
import { AlertCircleIcon, CheckIcon } from './Icons';
import type { FormProps } from '../../types';

export const Form: React.FC<FormProps> = ({ error, success, children, ...props }) => {
  return (
    <form {...props} className={`space-y-4 ${props.className || ''}`}>
      {error && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#e0596b]/20 bg-[#e0596b]/5 text-[#e0596b] text-sm animate-[fadeIn_0.2s_ease] mb-4">
          <AlertCircleIcon size={16} className="mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{error}</span>
        </div>
      )}
      {success && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg border border-[#1ec8b5]/20 bg-[#1ec8b5]/5 text-[#1ec8b5] text-sm animate-[fadeIn_0.2s_ease] mb-4">
          <CheckIcon size={16} className="mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed">{success}</span>
        </div>
      )}
      {children}
    </form>
  );
};
