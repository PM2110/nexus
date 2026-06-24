import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import type { DropdownProps } from '../../types';
import '../../styles/dropdown.css';

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block w-full text-left" ref={dropdownRef}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="dropdown-trigger glass-card"
          id="menu-button"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span>{selectedOption ? selectedOption.label : placeholder || t('common.dropdown_placeholder')}</span>
          <svg
            className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 rounded-lg overlay-panel max-h-60 overflow-y-auto premium-scrollbar origin-top-right transition-all">
          <div className="py-1" role="none">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`dropdown-item ${option.value === value
                    ? 'dropdown-item-active'
                    : 'dropdown-item-inactive'
                  }`}
                role="menuitem"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
