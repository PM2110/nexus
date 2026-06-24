import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LinkIcon, ExternalLinkIcon, ArrowRightTailIcon } from '../common/Icons';

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

  const getPlatformClass = (platform?: string) => {
    if (!platform) return 'pill-custom';
    const p = platform.toLowerCase();
    if (p.includes('leetcode')) return 'pill-leetcode';
    if (p.includes('codeforces')) return 'pill-codeforces';
    return 'pill-custom';
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCopyLink(workspace.inviteCode);
  };

  const handleProblemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--mx', `${x}%`);
    e.currentTarget.style.setProperty('--my', `${y}%`);
  };

  return (
    <div className="ws-card rise" onClick={() => onOpen(workspace.id)} onMouseMove={handleMouseMove}>
      <div className="ws-card-top">
        <h3 className="ws-card-name">{workspace.name}</h3>
        {workspace.problemPlatform && (
          <span className={`ws-platform-pill ${getPlatformClass(workspace.problemPlatform)}`}>
            {workspace.problemPlatform.toUpperCase()}
          </span>
        )}
      </div>

      <div className="ws-card-meta">
        {workspace.problemUrl ? (
          <a
            href={workspace.problemUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleProblemClick}
            className="ws-meta-link"
          >
            <ExternalLinkIcon size={13} />
            {workspace.problemUrl}
          </a>
        ) : (
          <div className="ws-meta-link italic">
            {t('dashboard.no_problem_linked', { defaultValue: 'No problem linked' })}
          </div>
        )}

        {workspace.owner && (
          <div className="ws-owner-row">
            {workspace.owner.avatar ? (
              <img
                src={workspace.owner.avatar}
                alt={workspace.owner.name}
                className="ws-owner-avatar object-cover"
              />
            ) : (
              <div className="ws-owner-avatar">
                {workspace.owner.name.substring(0, 2).toUpperCase()}
              </div>
            )}
            <span className="ws-owner-name">
              {workspace.owner.name} {workspace.myRole === 'owner' ? `(${t('dashboard.owner_label', { defaultValue: 'Owner' })})` : ''}
            </span>
          </div>
        )}
      </div>

      <div className="ws-card-footer">
        <span className="ws-participants">
          {workspace.membersCount || 1} {t('dashboard.participant')}
        </span>
        <div className="ws-card-actions">
          <button
            className="icon-btn"
            onClick={handleCopy}
            title={t('dashboard.copy_invite_link')}
          >
            <LinkIcon size={14} />
          </button>
          <span className="ws-open-btn">
            {t('dashboard.open')}
            <ArrowRightTailIcon size={11} />
          </span>
        </div>
      </div>
    </div>
  );
};

