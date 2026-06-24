import React from 'react';
import type { IconProps } from '../../types';

export const BrandIcon: React.FC<IconProps> = ({ size = 28, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className} {...props}>
    <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
    <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" strokeWidth="1.3" opacity="0.8" />
    <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" strokeWidth="1.2" opacity="0.75" transform="rotate(28 16 16)" />
    <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" strokeWidth="1.2" opacity="0.4" transform="rotate(-28 16 16)" />
  </svg>
);

export const GoogleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} {...props}>
    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#9aa5b3" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#9aa5b3" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#9aa5b3" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
    <path d="M12 1C5.92 1 1 5.92 1 12c0 4.87 3.15 8.99 7.53 10.45.55.1.75-.24.75-.53 0-.26-.01-1.13-.02-2.05-3.06.67-3.71-1.3-3.71-1.3-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.67.07-.67 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.57 1.19 3.2.91.1-.71.38-1.19.69-1.46-2.44-.28-5.01-1.22-5.01-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13a10.5 10.5 0 0 1 5.5 0c2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.58 5.15-5.03 5.42.39.34.74 1.02.74 2.05 0 1.48-.01 2.67-.01 3.04 0 .29.2.64.76.53C19.85 20.98 23 16.87 23 12c0-6.08-4.92-11-11-11z" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M2 4.5l6 4.5 6-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <rect x="3" y="7" width="10" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.4" />
    <path d="M5.5 7V4.8a2.5 2.5 0 0 1 5 0V7" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M3 13c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const EyeOffIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
    <line x1="3" y1="3" x2="13" y2="13" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({ size = 14, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const AlertCircleIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className} {...props}>
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
    <line x1="8" y1="5" x2="8" y2="9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <circle cx="8" cy="11.5" r="0.75" fill="currentColor" />
  </svg>
);

export const SpinnerIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`animate-spin ${className}`} {...props}>
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const FolderIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

export const UserPlusIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="8.5" cy="7" r="4" />
    <line x1="20" y1="8" x2="20" y2="14" />
    <line x1="23" y1="11" x2="17" y2="11" />
  </svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 16, className = '', ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

