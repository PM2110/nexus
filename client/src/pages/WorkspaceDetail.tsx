import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../services';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { Navbar } from '../components/common/Navbar';
import '../styles/workspace-detail.css';
import {
  SpinnerIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  TerminalWindowIcon
} from '../components/common/Icons';

export const WorkspaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [workspace, setWorkspace] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedInvite, setCopiedInvite] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchWorkspaceDetails = async () => {
      try {
        const data = await workspaceService.getWorkspaceById(id);
        setWorkspace(data.workspace);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch workspace details. You may not have access to this workspace.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaceDetails();
  }, [id]);

  const handleCopyInvite = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 2000);
    } catch (err) {
      // Ignored
    }
  };

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Background ambient elements */}
      <div className="ambient" />

      {/* Nav */}
      <Navbar />

      {isLoading ? (
        <div className="wrap wrap-narrow pt-36">
          <div className="center-loading">
            <SpinnerIcon size={34} className="animate-spin" />
            <span>{t('dashboard.workspace_detail.initializing')}</span>
          </div>
        </div>
      ) : error ? (
        <div className="wrap wrap-narrow pt-36">
          <div className="error-card">
            <div className="error-icon">
              <AlertCircleIcon size={24} />
            </div>
            <h3>{t('dashboard.workspace_detail.access_denied')}</h3>
            <p>{error}</p>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/dashboard')}>
              {t('dashboard.workspace_detail.go_to_dashboard')}
            </button>
          </div>
        </div>
      ) : workspace ? (
        <div className="wrap wrap-narrow wsd-content">
          <div className="wsd-header rise" style={{ animationDelay: '.05s' }}>
            <div>
              <div className="wsd-id">
                {t('dashboard.workspace_id')}: {workspace.id}
              </div>
              <h1 className="wsd-name">{workspace.name}</h1>
              <div className="wsd-meta">
                Created {new Date(workspace.createdAt).toLocaleDateString()} · Invite code
                <span
                  onClick={() => handleCopyInvite(workspace.inviteCode)}
                  className="invite-chip"
                  title="Click to copy invite code"
                >
                  {copiedInvite ? t('dashboard.copied', { defaultValue: 'COPIED' }) : workspace.inviteCode.toUpperCase()}
                </span>
              </div>
            </div>

            {workspace.problemUrl && (
              <a
                href={workspace.problemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="problem-link"
              >
                <ExternalLinkIcon size={15} />
                Problem Platform: {workspace.problemPlatform || 'Custom'}
              </a>
            )}
          </div>

          <div className="editor-stage rise" style={{ animationDelay: '.15s' }}>
            {/* Fake Monaco top bar */}
            <div className="editor-top">
              <div className="editor-top-left">
                <div className="tb-dots">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="sheet-tab-chip active"><span className="dot" /> Shared Sheet</div>
                <div className="sheet-tab-chip"><span className="dot" /> Personal — {user?.name?.split(' ')[0] || 'User'}</div>
                <div className="sheet-tab-chip"><span className="dot" /> Notes</div>
                <div className="sheet-tab-chip"><span className="dot" /> Final Solution</div>
              </div>

              <div className="presence-stack">
                {workspace.members && workspace.members.slice(0, 2).map((member: any, idx: number) => (
                  <div
                    key={member.id || idx}
                    className={`presence-av ${idx === 0 ? 'presence-teal' : 'presence-gold'}`}
                    title={`${member.user.name} (${member.role})`}
                  >
                    {member.user.name.substring(0, 1).toUpperCase()}
                  </div>
                ))}
                {workspace.members && workspace.members.length > 2 && (
                  <div className="presence-av presence-more" title={`+${workspace.members.length - 2} more`}>
                    +{workspace.members.length - 2}
                  </div>
                )}
              </div>
            </div>

            {/* Fake workspace content */}
            <div className="editor-empty">
              <div className="pulse-ring">
                <TerminalWindowIcon size={26} />
              </div>
              <h3>
                {t('dashboard.workspace_detail.environment_initialized')}
                <span className="typing-cursor" />
              </h3>
              <p>
                {t('dashboard.workspace_detail.environment_placeholder')}
              </p>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" style={{ width: '12px', height: '12px', transform: 'rotate(180deg)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8h10M9 4l4 4-4 4" /></svg>
                {t('dashboard.workspace_detail.go_to_dashboard')}
              </button>
            </div>

            {/* Fake editor footer status */}
            <div className="editor-bottom">
              <div className="status-live">
                <span className="dot" />
                Live · {workspace.members?.length || 1} connected
              </div>
              <span className="mono">UTF-8 · main</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

