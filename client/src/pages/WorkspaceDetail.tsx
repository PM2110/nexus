import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../services';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { DashboardNavbar } from '../components/dashboard/DashboardNavbar';
import {
  SpinnerIcon,
  AlertCircleIcon,
  ExternalLinkIcon,
  TerminalIcon
} from '../components/common/Icons';

export const WorkspaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const [workspace, setWorkspace] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Radial ambient light */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_800px_450px_at_50%_-10%,rgba(30,200,181,0.06),transparent_60%)] pointer-events-none z-0" />

      {/* Nav */}
      <DashboardNavbar user={user} logout={logout} />

      {/* Content wrapper */}
      <div className="section-container max-w-5xl pt-28 pb-12 relative z-10">
        {isLoading ? (
          <div className="flex flex-col gap-4 py-20 items-center justify-center">
            <SpinnerIcon size={40} className="text-[#1ec8b5]" />
            <span className="text-sm text-[#5e6a7a] font-mono">{t('dashboard.workspace_detail.initializing')}</span>
          </div>
        ) : error ? (
          <div className="border border-[#e0596b]/30 rounded-xl p-8 bg-[#e0596b]/5 max-w-lg mx-auto text-center flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#e0596b]/10 flex items-center justify-center text-[#e0596b]">
              <AlertCircleIcon size={24} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">{t('dashboard.workspace_detail.access_denied')}</h3>
              <p className="text-xs text-[#5e6a7a] mt-1">{error}</p>
            </div>
            <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} className="mt-2">
              {t('dashboard.workspace_detail.go_to_dashboard')}
            </Button>
          </div>
        ) : workspace ? (
          <div className="flex flex-col gap-8">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222b38]/50 pb-6">
              <div>
                <span className="text-[10px] text-[#1ec8b5] font-mono tracking-widest uppercase">
                  {t('dashboard.workspace_id')}: {workspace.id}
                </span>
                <h1 className="text-2xl font-serif text-white font-semibold mt-1">{workspace.name}</h1>
                <p className="text-xs text-[#5e6a7a] mt-1 flex items-center gap-2">
                  {t('dashboard.workspace_detail.created_at')} {new Date(workspace.createdAt).toLocaleDateString()} · {t('dashboard.workspace_detail.invite_code')}
                  <span className="font-mono text-[#9aa5b3] font-semibold bg-[#131a24] border border-[#222b38] px-2 py-0.5 rounded select-all uppercase tracking-wider">
                    {workspace.inviteCode}
                  </span>
                </p>
              </div>

              {workspace.problemUrl && (
                <a
                  href={workspace.problemUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#131a24] hover:bg-[#1a222e] border border-[#222b38] rounded-lg text-xs text-[#9aa5b3] hover:text-[#1ec8b5] transition-all max-w-xs truncate font-mono"
                >
                  <ExternalLinkIcon size={16} className="flex-shrink-0" />
                  {t('dashboard.workspace_detail.platform')} {workspace.problemPlatform || 'Unknown'}
                </a>
              )}
            </div>

            {/* Simulated collaborative interface outline */}
            <div className="border border-[#222b38] rounded-xl overflow-hidden bg-[#0d1219] shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col h-[60vh]">
              {/* Fake Monaco top bar */}
              <div className="bg-[#131a24] border-b border-[#222b38] px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5e6a7a]/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5e6a7a]/50" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#5e6a7a]/50" />
                  </div>
                  {workspace.sheets.map((sheet: any) => (
                    <span
                      key={sheet.id}
                      className="text-xs px-3 py-1 rounded bg-[#0d1219] border border-[#222b38] text-[#1ec8b5] font-mono flex items-center gap-1.5 select-none"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1ec8b5]" />
                      {sheet.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center -space-x-1.5">
                  {workspace.members.slice(0, 4).map((member: any) => (
                    <div
                      key={member.id}
                      className="w-5.5 h-5.5 rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9px] font-semibold text-[#0a0e14] bg-[#1ec8b5] cursor-default"
                      title={`${member.user.name} (${member.role})`}
                    >
                      {member.user.name.substring(0, 1).toUpperCase()}
                    </div>
                  ))}
                  {workspace.members.length > 4 && (
                    <div className="w-5.5 h-5.5 rounded-full border-2 border-[#131a24] flex items-center justify-center font-mono text-[9px] font-semibold text-white bg-[#222b38] cursor-default">
                      +{workspace.members.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Fake workspace content */}
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-4 bg-[#0a0e14]/50">
                <div className="w-12 h-12 rounded-full bg-[#1ec8b5]/5 border border-[#1ec8b5]/20 flex items-center justify-center text-[#1ec8b5]">
                  <TerminalIcon size={24} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">{t('dashboard.workspace_detail.environment_initialized')}</h3>
                  <p className="text-xs text-[#5e6a7a] mt-1 max-w-md leading-relaxed">
                    {t('dashboard.workspace_detail.environment_placeholder')}
                  </p>
                </div>
                <div className="flex gap-3 mt-2">
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
                    {t('dashboard.workspace_detail.go_to_dashboard')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
