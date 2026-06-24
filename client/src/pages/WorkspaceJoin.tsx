import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../services';
import { Button } from '../components/common/Button';

export const WorkspaceJoin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteCode = searchParams.get('code');

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
    <div className="page-wrapper min-h-screen bg-[#0a0e14] flex flex-col justify-center items-center p-4">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_600px_400px_at_50%_40%,rgba(30,200,181,0.08),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_500px_300px_at_50%_80%,rgba(203,161,53,0.04),transparent_60%)] pointer-events-none z-0" />

      <div className="w-full max-w-md bg-[#0d1219] border border-[#222b38] rounded-xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10 text-center flex flex-col items-center gap-6 animate-[fadeIn_0.3s_ease]">
        
        {/* Brand/App logo */}
        <div className="flex items-center gap-2.5 cursor-pointer mb-2" onClick={() => navigate('/')}>
          <svg className="w-6.5 h-6.5" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="3" fill="#1ec8b5" />
            <circle cx="16" cy="16" r="10.5" stroke="#1ec8b5" strokeWidth="1.3" opacity="0.8" />
            <ellipse cx="16" cy="16" rx="14" ry="6" stroke="#cba135" strokeWidth="1.2" opacity="0.75" transform="rotate(28 16 16)" />
          </svg>
          <span className="font-serif font-semibold text-lg text-white">Nexus</span>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-4 py-8 items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-[#1ec8b5]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-xs text-[#5e6a7a] font-mono">Loading invitation details...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-5 items-center">
            <div className="w-12 h-12 rounded-full bg-[#e0596b]/10 border border-[#e0596b]/20 flex items-center justify-center text-[#e0596b]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Invalid Invitation</h3>
              <p className="text-xs text-[#5e6a7a] mt-1.5 leading-relaxed">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="mt-2">
              Back to Dashboard
            </Button>
          </div>
        ) : workspace ? (
          <div className="flex flex-col gap-6 w-full items-center">
            
            {/* User invite info */}
            <div className="flex flex-col items-center gap-3">
              {workspace.ownerAvatar ? (
                <img src={workspace.ownerAvatar} alt={workspace.ownerName} className="w-12 h-12 rounded-full border border-[#1ec8b5]/20 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#131a24] border border-[#222b38] flex items-center justify-center font-mono text-sm text-[#1ec8b5] font-semibold">
                  {workspace.ownerName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-xs text-[#5e6a7a] font-mono">
                <span className="text-[#9aa5b3] font-medium">{workspace.ownerName}</span> invited you to join:
              </div>
            </div>

            {/* Workspace Card */}
            <div className="w-full bg-[#131a24]/50 border border-[#222b38] p-5 rounded-lg flex flex-col gap-2">
              <h2 className="text-base font-semibold text-white line-clamp-2">{workspace.name}</h2>
              <span className="text-[10px] text-[#1ec8b5] font-mono tracking-wider">CODE: {inviteCode}</span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 w-full border-t border-[#222b38]/50 pt-5 mt-2">
              <Button variant="primary" onClick={handleJoin} disabled={isJoining} className="w-full bg-[#1ec8b5] hover:bg-[#1ec8b5]/90 text-[#0a0e14] border-none shadow-[0_4px_12px_rgba(30,200,181,0.2)]">
                {isJoining ? 'Joining...' : 'Accept Invitation & Join'}
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                Decline
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
