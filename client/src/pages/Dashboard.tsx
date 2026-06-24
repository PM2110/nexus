import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { workspaceService, friendService } from '../services';
import {
  FolderIcon,
  SpinnerIcon,
  PlusIcon,
  JoinIcon
} from '../components/common/Icons';
import type { Workspace, Friend } from '../types';

// Extracted Subcomponents
import { Navbar } from '../components/common/Navbar';
import { WorkspaceCard } from '../components/dashboard/WorkspaceCard';
import { JoinWorkspaceModal } from '../components/dashboard/JoinWorkspaceModal';
import { CreateWorkspaceModal } from '../components/dashboard/CreateWorkspaceModal';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Workspace lists
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);

  // Modal controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Join workspace state
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Create workspace state
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Create Modal Friends Selector List state (needed to invite friends during workspace creation)
  const [selectorFriends, setSelectorFriends] = useState<Friend[]>([]);
  const [selectorSearch, setSelectorSearch] = useState('');
  const [selectorPage, setSelectorPage] = useState(1);
  const [selectorHasMore, setSelectorHasMore] = useState(false);
  const [selectorLoading, setSelectorLoading] = useState(false);

  // Fetch workspaces
  const fetchWorkspaces = useCallback(async () => {
    setIsLoadingWorkspaces(true);
    try {
      const data = await workspaceService.getWorkspaces();
      setWorkspaces(data.workspaces);
    } catch (err: any) {
      console.error('Error fetching workspaces:', err);
    } finally {
      setIsLoadingWorkspaces(false);
    }
  }, []);

  // Fetch friends for the Workspace Creation Modal Selector (paginated)
  const fetchSelectorFriends = useCallback(async (searchQuery: string, pageNum: number, append: boolean = false) => {
    setSelectorLoading(true);
    try {
      const data = await friendService.getFriends(searchQuery, pageNum, 6);
      if (append) {
        setSelectorFriends((prev) => [...prev, ...data.friends]);
      } else {
        setSelectorFriends(data.friends);
      }
      setSelectorHasMore(data.hasMore);
      setSelectorPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching selector friends:', err);
    } finally {
      setSelectorLoading(false);
    }
  }, []);

  // Init fetch on load
  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  // Handle selector friends search (in Create Modal)
  const handleSelectorSearch = (value: string) => {
    setSelectorSearch(value);
    fetchSelectorFriends(value, 1);
  };

  const loadMoreSelectorFriends = () => {
    if (!selectorLoading && selectorHasMore) {
      fetchSelectorFriends(selectorSearch, selectorPage + 1, true);
    }
  };

  // Workspace Creation Submit wrapper
  const handleCreateWorkspace = async (
    name: string,
    problemUrl: string,
    problemPlatform: string,
    friendIds: string[]
  ) => {
    setCreateError(null);
    setIsCreating(true);
    try {
      const result = await workspaceService.createWorkspace({
        name,
        problemUrl,
        problemPlatform,
        invitedFriends: friendIds
      });
      fetchWorkspaces();
      return result.workspace;
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create workspace');
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Workspace Joining Submit wrapper
  const handleJoinWorkspace = async (code: string) => {
    setJoinError(null);
    setIsJoining(true);
    try {
      const result = await workspaceService.joinWorkspace(code);
      setIsJoinOpen(false);
      navigate(`/workspace/${result.workspaceId}`);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join workspace');
    } finally {
      setIsJoining(false);
    }
  };

  // Copy invitation link to clipboard
  const handleCopyLink = async (code: string) => {
    try {
      const inviteLink = `${window.location.origin}/workspace/join?code=${code}`;
      await navigator.clipboard.writeText(inviteLink);
      alert('Workspace invite link copied to clipboard!');
    } catch (err) {
      // Ignored
    }
  };

  // Open Create Modal & reset states
  const openCreateModal = () => {
    setCreateError(null);
    setIsCreateOpen(true);
    fetchSelectorFriends('', 1);
  };

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Background ambient elements */}
      <div className="ambient" />

      {/* Navigation */}
      <Navbar />

      {/* Dashboard Header */}
      <div className="wrap dash-header">
        <div className="dash-eyebrow rise" style={{ animationDelay: '.05s' }}>
          <span className="glow-dot" /> SESSION ACTIVE
        </div>
      </div>

      {/* Main Content */}
      <main className="wrap pb-20 rise" style={{ animationDelay: '.1s' }}>
        <div className="dash-title-row">
          <div>
            <h1 className="dash-title">{t('dashboard.workspaces_title')}</h1>
            <p className="dash-subtitle">{t('dashboard.workspaces_subtitle')}</p>
          </div>
          <div className="dash-actions">
            <button className="btn btn-outline" onClick={() => setIsJoinOpen(true)}>
              <JoinIcon />
              {t('dashboard.btn_join_workspace')}
            </button>
            <button className="btn btn-primary" onClick={openCreateModal}>
              <PlusIcon />
              {t('dashboard.btn_new_workspace')}
            </button>
          </div>
        </div>

        {/* Workspaces list view */}
        {isLoadingWorkspaces ? (
          <div className="flex flex-col gap-4 py-20 items-center justify-center">
            <SpinnerIcon size={32} className="text-[#1ec8b5] animate-spin" />
            <span className="text-xs text-[#5e6a7a] font-mono">{t('dashboard.fetching_workspaces')}</span>
          </div>
        ) : workspaces.length === 0 ? (
          <div className="empty-state" onClick={openCreateModal} style={{ cursor: 'pointer', padding: '80px 40px' }}>
            <div className="empty-icon">
              <FolderIcon size={22} />
            </div>
            <h3>{t('dashboard.no_workspaces_title')}</h3>
            <p>{t('dashboard.no_workspaces_desc')}</p>
          </div>
        ) : (
          <div className="ws-grid">
            {workspaces.map((w) => (
              <WorkspaceCard
                key={w.id}
                workspace={w}
                onCopyLink={handleCopyLink}
                onOpen={(id) => navigate(`/workspace/${id}`)}
              />
            ))}

            {/* empty-style CTA card slot */}
            <div className="empty-state" style={{ padding: '30px 20px', cursor: 'pointer' }} onClick={openCreateModal}>
              <div className="empty-icon">
                <PlusIcon size={18} />
              </div>
              <h3>Start a new session</h3>
              <p>Spin up a workspace and import a problem in seconds.</p>
            </div>
          </div>
        )}
      </main>

      {/* Join Workspace Modal */}
      <JoinWorkspaceModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onJoin={handleJoinWorkspace}
        isJoining={isJoining}
        joinError={joinError}
      />

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateWorkspace}
        isCreating={isCreating}
        createError={createError}
        selectorFriends={selectorFriends}
        selectorLoading={selectorLoading}
        selectorHasMore={selectorHasMore}
        onSelectorSearch={handleSelectorSearch}
        onLoadMoreSelector={loadMoreSelectorFriends}
      />
    </div>
  );
};
