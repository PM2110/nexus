import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from '../common/Button';
import { CopyIcon, ExternalLinkIcon } from '../common/Icons';

interface WorkspaceCardProps {
  workspace: any;
  onCopyLink: (code: string) => void;
  onOpen: (id: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
  workspace,
  onCopyLink,
  onOpen
}) => {
  const { t } = useTranslation();

  return (
    <div className="border border-[#222b38] hover:border-[#1ec8b5]/30 rounded-xl p-5 bg-[#0d1219] hover:bg-[#0d1219]/80 transition-all duration-300 group flex flex-col justify-between gap-4 h-full relative">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#1ec8b5] transition-colors line-clamp-1">
            {workspace.name}
          </h3>
          {workspace.problemPlatform && (
            <span className="text-[9px] font-mono text-[#cba135] bg-[#cba135]/5 border border-[#cba135]/20 px-2 py-0.5 rounded uppercase tracking-wider">
              {workspace.problemPlatform}
            </span>
          )}
        </div>

        {/* Problem URL (if any) */}
        {workspace.problemUrl ? (
          <a
            href={workspace.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-[#5e6a7a] hover:text-[#1ec8b5] font-mono mt-1.5 flex items-center gap-1 max-w-[220px] truncate transition-colors"
          >
            <ExternalLinkIcon size={12} className="flex-shrink-0" />
            {workspace.problemUrl}
          </a>
        ) : (
          <p className="text-[11px] text-[#5e6a7a] italic mt-1.5 font-mono">
            No problem linked
          </p>
        )}
      </div>

      {/* Footer options */}
      <div className="flex items-center justify-between border-t border-[#222b38]/50 pt-3 mt-1">
        <span className="text-[11px] text-[#5e6a7a] font-mono">
          {workspace.membersCount || 1} {t('dashboard.participant')}
        </span>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onCopyLink(workspace.inviteCode)}
            className="p-1.5 rounded hover:bg-[#1a232d] text-[#5e6a7a] hover:text-white transition-colors cursor-pointer"
            title={t('dashboard.copy_invite_link')}
          >
            <CopyIcon size={14} />
          </button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpen(workspace.id)}
            className="text-xs py-1.5 px-3 group-hover:bg-[#1ec8b5] group-hover:text-[#0a0e14] group-hover:border-none transition-all duration-300"
          >
            {t('dashboard.open')}
          </Button>
        </div>
      </div>
    </div>
  );
};
