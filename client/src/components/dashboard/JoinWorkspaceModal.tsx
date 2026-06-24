import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { AlertCircleIcon, CloseIcon, JoinIcon } from '../common/Icons';

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
    <div className="modal-overlay">
      <div className="modal-card">
        <div className="modal-head">
          <h2>
            <JoinIcon size={17} />
            {t('dashboard.join_modal_title')}
          </h2>
          <button onClick={onClose} className="modal-close">
            <CloseIcon size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {joinError && (
              <div className="bg-[#e0596b]/10 border border-[#e0596b]/20 text-[#e0596b] text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircleIcon size={16} className="flex-shrink-0" />
                {joinError}
              </div>
            )}
            <div>
              <label className="field-label">{t('dashboard.join_modal_label')}</label>
              <input
                type="text"
                className="field-input field-code"
                placeholder={t('dashboard.join_modal_subtitle')}
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                maxLength={8}
                disabled={isJoining}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={onClose}
              disabled={isJoining}
            >
              {t('dashboard.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isJoining}
            >
              {isJoining ? t('dashboard.joining') : t('dashboard.btn_join_room')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

