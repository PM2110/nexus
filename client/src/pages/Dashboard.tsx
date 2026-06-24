import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../hooks/useTranslation';
import { workspaceService, friendService } from '../services';
import { SearchInput } from '../components/common/SearchInput';
import { InfiniteScroll } from '../components/common/InfiniteScroll';
import {
  FolderIcon,
  SpinnerIcon,
  PlusIcon,
  JoinIcon
} from '../components/common/Icons';
import type { Workspace, Friend, FriendRequest } from '../types';

// Extracted Subcomponents
import { Navbar } from '../components/common/Navbar';
import { WorkspaceCard } from '../components/dashboard/WorkspaceCard';
import { FriendRequestItem } from '../components/dashboard/FriendRequestItem';
import { FriendItem } from '../components/dashboard/FriendItem';
import { JoinWorkspaceModal } from '../components/dashboard/JoinWorkspaceModal';
import { CreateWorkspaceModal } from '../components/dashboard/CreateWorkspaceModal';
import '../styles/dashboard.css';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Workspace lists
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);

  // Invite requests / Notifications
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Friends list with search and infinite scroll
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [hasMoreFriends, setHasMoreFriends] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Modal controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // Join workspace state
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // Create workspace state
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Create Modal Friends Selector List state
  const [selectorFriends, setSelectorFriends] = useState<Friend[]>([]);
  const [selectorSearch, setSelectorSearch] = useState('');
  const [selectorPage, setSelectorPage] = useState(1);
  const [selectorHasMore, setSelectorHasMore] = useState(false);
  const [selectorLoading, setSelectorLoading] = useState(false);

  // Add friend panel state
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [userSearchResult, setUserSearchResult] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchPage, setUserSearchPage] = useState(1);
  const [userSearchHasMore, setUserSearchHasMore] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

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

  // Fetch incoming friend requests
  const fetchFriendRequests = useCallback(async () => {
    try {
      const data = await friendService.getFriendRequests();
      setFriendRequests(data.requests);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
    }
  }, []);

  // Fetch friends list (paginated)
  const fetchFriends = useCallback(async (searchQuery: string, pageNum: number, append: boolean = false) => {
    setIsLoadingFriends(true);
    try {
      const data = await friendService.getFriends(searchQuery, pageNum, 8);
      if (append) {
        setFriends((prev) => [...prev, ...data.friends]);
      } else {
        setFriends(data.friends);
      }
      setHasMoreFriends(data.hasMore);
      setFriendsPage(pageNum);
    } catch (err: any) {
      console.error('Error fetching friends:', err);
    } finally {
      setIsLoadingFriends(false);
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

  // Search users to add as friends (paginated)
  const fetchUsersToRequest = useCallback(async (searchQuery: string, pageNum: number, append: boolean = false) => {
    setUserSearchLoading(true);
    try {
      const data = await friendService.searchUsersToRequest(searchQuery, pageNum, 5);
      if (append) {
        setUserSearchResult((prev) => [...prev, ...data.users]);
      } else {
        setUserSearchResult(data.users);
      }
      setUserSearchHasMore(data.hasMore);
      setUserSearchPage(pageNum);
    } catch (err: any) {
      console.error('Error searching users:', err);
    } finally {
      setUserSearchLoading(false);
    }
  }, []);

  // Init fetch on load
  useEffect(() => {
    fetchWorkspaces();
    fetchFriendRequests();
    fetchFriends('', 1);
  }, [fetchWorkspaces, fetchFriendRequests, fetchFriends]);

  // Handle main friends list search
  const handleFriendsSearch = (value: string) => {
    setFriendsSearch(value);
    fetchFriends(value, 1);
  };

  const loadMoreFriends = () => {
    if (!isLoadingFriends && hasMoreFriends) {
      fetchFriends(friendsSearch, friendsPage + 1, true);
    }
  };

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

  // Handle add-friend search
  const handleUserSearch = (value: string) => {
    setUserSearchTerm(value);
    fetchUsersToRequest(value, 1);
  };

  const loadMoreUserSearch = () => {
    if (!userSearchLoading && userSearchHasMore) {
      fetchUsersToRequest(userSearchTerm, userSearchPage + 1, true);
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

  // Accept Friend Request
  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      await friendService.acceptFriendRequest(friendshipId);
      fetchFriendRequests();
      fetchFriends(friendsSearch, 1);
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    }
  };

  // Reject Friend Request
  const handleRejectRequest = async (friendshipId: number) => {
    try {
      await friendService.rejectFriendRequest(friendshipId);
      fetchFriendRequests();
    } catch (err: any) {
      alert(err.message || 'Failed to decline request');
    }
  };

  // Send Friend Request
  const handleSendFriendRequest = async (friendId: string) => {
    try {
      await friendService.sendFriendRequest(friendId);
      fetchUsersToRequest(userSearchTerm, 1);
      alert('Friend request sent!');
    } catch (err: any) {
      alert(err.message || 'Failed to send request');
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

  // Open Add Friend section & fetch users
  const toggleAddFriend = () => {
    const newState = !showAddFriend;
    setShowAddFriend(newState);
    if (newState) {
      setUserSearchTerm('');
      fetchUsersToRequest('', 1);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Background ambient elements */}
      <div className="ambient" />

      {/* Navigation */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Dashboard Header */}
      <div className="wrap-xl dash-header">
        <div className="dash-eyebrow rise" style={{ animationDelay: '.05s' }}>
          <span className="glow-dot" /> SESSION ACTIVE
        </div>
      </div>

      {/* Main Grid */}
      <main className="wrap-xl dash-grid">

        {/* LEFT: WORKSPACES */}
        <div id="workspaces-section" className="rise scroll-mt-24" style={{ animationDelay: '.1s' }}>
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
            <div className="flex flex-col gap-4 py-12 items-center justify-center">
              <SpinnerIcon size={32} className="text-[#1ec8b5] animate-spin" />
              <span className="text-xs text-[#5e6a7a] font-mono">{t('dashboard.fetching_workspaces')}</span>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="empty-state" onClick={openCreateModal} style={{ cursor: 'pointer' }}>
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
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="rise" style={{ animationDelay: '.26s' }}>

          {/* Notifications Panel */}
          {friendRequests.length > 0 && (
            <div className="side-panel">
              <div className="side-panel-title">
                <span className="glow-dot danger" />
                {t('dashboard.notifications_title')}
              </div>
              <div className="flex flex-col gap-3">
                {friendRequests.map((req) => (
                  <FriendRequestItem
                    key={req.friendshipId}
                    request={req}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Friends List Panel */}
          <div id="friends-section" className="side-panel scroll-mt-24">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="side-panel-title">{t('dashboard.nav_friends')}</div>
              <button onClick={toggleAddFriend} className="add-friend-link">
                {showAddFriend ? t('dashboard.btn_close_search') : `+ ${t('dashboard.btn_add_friend')}`}
              </button>
            </div>

            {/* Send request search sub-panel */}
            {showAddFriend && (
              <div className="add-friend-box">
                <p className="add-friend-desc">{t('dashboard.search_developers_desc')}</p>
                <SearchInput placeholder={t('dashboard.search_placeholder')} onSearch={handleUserSearch} debounceMs={300} />

                <div className="search-results max-h-48 overflow-y-auto mt-2 flex flex-col gap-2">
                  <InfiniteScroll loadMore={loadMoreUserSearch} hasMore={userSearchHasMore} isLoading={userSearchLoading}>
                    {userSearchResult.length === 0 ? (
                      <p className="text-[11px] text-[#5e6a7a] py-2 text-center italic">{t('dashboard.no_developers_found')}</p>
                    ) : (
                      userSearchResult.map((u) => (
                        <div key={u.id} className="friend-row justify-between">
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="friend-avatar object-cover" />
                            ) : (
                              <div className="friend-avatar">
                                {u.name.substring(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <div className="friend-name">{u.name}</div>
                              <div className="friend-email">{u.email}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSendFriendRequest(u.id)}
                            className="btn btn-primary btn-xs"
                          >
                            {t('dashboard.add')}
                          </button>
                        </div>
                      ))
                    )}
                  </InfiniteScroll>
                </div>
              </div>
            )}

            {/* Standard Friends list with Search and Infinite Scroll */}
            <SearchInput placeholder="Search friends list..." onSearch={handleFriendsSearch} debounceMs={200} />

            <div className="friends-scroll">
              <InfiniteScroll loadMore={loadMoreFriends} hasMore={hasMoreFriends} isLoading={isLoadingFriends} loader={<div className="text-center py-2 text-xs text-[#5e6a7a]">Loading...</div>}>
                {friends.length === 0 ? (
                  <p className="text-xs text-[#5e6a7a] text-center py-4 italic">{t('dashboard.no_friends_added')}</p>
                ) : (
                  friends.map((f) => (
                    <FriendItem key={f.id} friend={f} />
                  ))
                )}
              </InfiniteScroll>
            </div>
          </div>
        </div>
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

