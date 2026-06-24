import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { AlertCircleIcon, CloseIcon } from '../common/Icons';

interface JoinWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (code: string) => Promise<void>;
  isJoining: boolean;
  joinError: string | null;
}

export const JoinWorkspaceModal: React.FC<JoinWorkspaceModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  isJoining,
  joinError
}) => {
  const { t } = useTranslation();
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoin(code.trim().toUpperCase());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease]">
      <div className="bg-[#0d1219] border border-[#222b38] rounded-xl w-full max-w-sm overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-300 transform scale-100">
        <div className="border-b border-[#222b38] px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1ec8b5] animate-pulse" />
            {t('dashboard.join_modal_title')}
          </h2>
          <button onClick={onClose} className="text-[#5e6a7a] hover:text-white transition-colors cursor-pointer">
            <CloseIcon size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 flex flex-col gap-4">
            {joinError && (
              <div className="bg-[#e0596b]/10 border border-[#e0596b]/20 text-[#e0596b] text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircleIcon size={16} className="flex-shrink-0" />
                {joinError}
              </div>
            )}
            <Input
              label={t('dashboard.join_modal_label')}
              placeholder={t('dashboard.join_modal_subtitle')}
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
              className="font-mono text-center tracking-wider text-base"
              maxLength={8}
            />
          </div>

          <div className="border-t border-[#222b38] px-6 py-4 bg-[#131a24]/30 flex items-center justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isJoining}>
              {t('dashboard.cancel')}
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isJoining}
              className="bg-[#1ec8b5] hover:bg-[#1ec8b5]/90 text-[#0a0e14] border-none shadow-[0_4px_12px_rgba(30,200,181,0.2)]"
            >
              {isJoining ? t('dashboard.joining') : t('dashboard.btn_join_room')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
