import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../services';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/workspace-join.css';
import { BrandIcon, SpinnerIcon, AlertCircleIcon } from '../components/common/Icons';

export const WorkspaceJoin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteCode = searchParams.get('code');
  const { t } = useTranslation();

  const [workspace, setWorkspace] = useState<{ id: string; name: string; ownerName: string; ownerAvatar?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!inviteCode) {
      setError('Invite code is missing in the URL.');
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const data = await workspaceService.getInviteDetails(inviteCode);
        setWorkspace(data.workspace);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch invitation details. The workspace may not exist or the link is invalid.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (!inviteCode) return;
    setIsJoining(true);
    try {
      const data = await workspaceService.joinWorkspace(inviteCode);
      navigate(`/workspace/${data.workspaceId}`);
    } catch (err: any) {
      setError(err.message || 'Failed to join the workspace.');
      setIsJoining(false);
    }
  };

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Background ambient elements */}
      <div className="ambient" />

      {isLoading ? (
        <div className="join-page">
          <div className="join-loading">
            <SpinnerIcon size={30} className="animate-spin" />
            <span>{t('dashboard.workspace_join.loading_details')}</span>
          </div>
        </div>
      ) : error ? (
        <div className="join-page">
          <div className="join-card rise" style={{ animationDelay: '.05s', padding: '30px' }}>
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#e0596b]/10 flex items-center justify-center text-[#e0596b]">
                <AlertCircleIcon size={24} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{t('dashboard.workspace_join.invalid_invitation')}</h3>
                <p className="text-xs text-[#5e6a7a] mt-1.5 leading-relaxed">{error}</p>
              </div>
              <button className="btn btn-outline btn-sm w-full justify-center" onClick={() => navigate('/dashboard')}>
                {t('dashboard.workspace_join.back_to_dashboard')}
              </button>
            </div>
          </div>
        </div>
      ) : workspace ? (
        <div className="join-page">
          <div className="join-card rise" style={{ animationDelay: '.05s' }}>
            {/* Brand */}
            <div className="join-brand cursor-pointer" onClick={() => navigate('/')}>
              <BrandIcon size={26} className="brand-mark" />
              <span className="brand-name">{t('common.brand')}</span>
            </div>

            {/* Invite info */}
            <div className="invite-from">
              {workspace.ownerAvatar ? (
                <img src={workspace.ownerAvatar} alt={workspace.ownerName} className="invite-owner-avatar object-cover" />
              ) : (
                <div className="invite-owner-avatar">
                  <div className="invite-owner-avatar-inner">
                    {workspace.ownerName.substring(0, 2).toUpperCase()}
                  </div>
                </div>
              )}
              <div className="invite-from-text">
                <strong>{workspace.ownerName}</strong> {t('dashboard.workspace_join.invited_you')}
              </div>
            </div>

            <div className="invite-ws-card">
              <h2>{workspace.name}</h2>
              <span className="invite-ws-code">CODE: {inviteCode}</span>
            </div>

            <div className="invite-actions">
              <button className="btn btn-primary btn-sm" onClick={handleJoin} disabled={isJoining}>
                {isJoining ? t('dashboard.workspace_join.joining') : t('dashboard.workspace_join.accept_and_join')}
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/dashboard')} disabled={isJoining}>
                {t('dashboard.workspace_join.decline')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

