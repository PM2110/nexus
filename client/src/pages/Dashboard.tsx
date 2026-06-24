import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { workspaceService, friendService } from '../services';
import { Button } from '../components/common/Button';
import { SearchInput } from '../components/common/SearchInput';
import { InfiniteScroll } from '../components/common/InfiniteScroll';
import {
  FolderIcon,
  SpinnerIcon,
  BellIcon
} from '../components/common/Icons';
import type { Workspace, Friend, FriendRequest } from '../types';

// Extracted Subcomponents
import { DashboardNavbar } from '../components/dashboard/DashboardNavbar';
import { WorkspaceCard } from '../components/dashboard/WorkspaceCard';
import { FriendRequestItem } from '../components/dashboard/FriendRequestItem';
import { FriendItem } from '../components/dashboard/FriendItem';
import { JoinWorkspaceModal } from '../components/dashboard/JoinWorkspaceModal';
import { CreateWorkspaceModal } from '../components/dashboard/CreateWorkspaceModal';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Workspace lists
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);

  // Invite requests / Notifications
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Friends list with search and infinite scroll
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [hasMoreFriends, setHasMoreFriends] = useState(true);
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
  const [selectorHasMore, setSelectorHasMore] = useState(true);
  const [selectorLoading, setSelectorLoading] = useState(false);

  // Add friend panel state
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [userSearchResult, setUserSearchResult] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userSearchPage, setUserSearchPage] = useState(1);
  const [userSearchHasMore, setUserSearchHasMore] = useState(true);
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
    setIsLoadingRequests(true);
    try {
      const data = await friendService.getFriendRequests();
      setFriendRequests(data.requests);
    } catch (err: any) {
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoadingRequests(false);
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
      {/* Background radial effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_800px_400px_at_15%_0%,rgba(30,200,181,0.08),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_600px_350px_at_85%_90%,rgba(203,161,53,0.05),transparent_60%)] pointer-events-none z-0" />

      {/* Navigation */}
      <DashboardNavbar user={user} logout={logout} scrollToSection={scrollToSection} />

      {/* Main Grid */}
      <div className="section-container max-w-7xl pt-28 pb-10 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Workspaces list (takes 2 cols on desktop) */}
        <div id="workspaces-section" className="lg:col-span-2 flex flex-col gap-6 scroll-mt-24">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-white font-medium">{t('dashboard.workspaces_title')}</h1>
              <p className="text-sm text-[#5e6a7a] mt-1 font-mono">{t('dashboard.workspaces_subtitle')}</p>
            </div>
            <div className="flex gap-3.5 flex-shrink-0">
              <Button variant="outline" size="md" onClick={() => setIsJoinOpen(true)}>
                {t('dashboard.btn_join_workspace')}
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={openCreateModal}
                className="bg-[#1ec8b5] hover:bg-[#1ec8b5]/90 text-[#0a0e14] border-none shadow-[0_4px_12px_rgba(30,200,181,0.2)]"
              >
                {t('dashboard.btn_new_workspace')}
              </Button>
            </div>
          </div>

          {/* Workspaces list view */}
          {isLoadingWorkspaces ? (
            <div className="flex flex-col gap-4 py-12 items-center justify-center">
              <SpinnerIcon size={32} className="text-[#1ec8b5]" />
              <span className="text-xs text-[#5e6a7a] font-mono">{t('dashboard.fetching_workspaces')}</span>
            </div>
          ) : workspaces.length === 0 ? (
            <div className="border border-dashed border-[#222b38] rounded-xl p-12 text-center flex flex-col items-center gap-4 bg-[#0d1219]/30">
              <div className="w-12 h-12 rounded-full bg-[#131a24] border border-[#222b38] flex items-center justify-center text-[#5e6a7a]">
                <FolderIcon size={24} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">{t('dashboard.no_workspaces_title')}</h3>
                <p className="text-xs text-[#5e6a7a] mt-1 max-w-sm">{t('dashboard.no_workspaces_desc')}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={openCreateModal}
                className="mt-2 text-xs border-[#1ec8b5]/30 hover:border-[#1ec8b5] hover:bg-[#1ec8b5]/5 text-[#1ec8b5]"
              >
                {t('dashboard.btn_create_first_workspace')}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {workspaces.map((w) => (
                <WorkspaceCard
                  key={w.id}
                  workspace={w}
                  onCopyLink={handleCopyLink}
                  onOpen={(id) => navigate(`/workspace/${id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Sidebar Panels (takes 1 col) */}
        <div className="flex flex-col gap-6">
          
          {/* Notifications Panel */}
          {friendRequests.length > 0 && (
            <div className="border border-[#222b38] rounded-xl p-5 bg-[#0d1219] flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#e0596b] animate-ping" />
                {t('dashboard.notifications_title')}
              </h3>
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
          <div id="friends-section" className="border border-[#222b38] rounded-xl p-5 bg-[#0d1219] flex flex-col gap-4 scroll-mt-24">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">{t('dashboard.nav_friends')}</h3>
              <button onClick={toggleAddFriend} className="text-xs text-[#1ec8b5] hover:underline font-mono cursor-pointer bg-transparent border-none">
                {showAddFriend ? t('dashboard.btn_close_search') : t('dashboard.btn_add_friend')}
              </button>
            </div>

            {/* Send request search sub-panel */}
            {showAddFriend && (
              <div className="border border-[#222b38] p-3 rounded-lg bg-[#131a24]/50 flex flex-col gap-3 animate-[fadeIn_0.2s_ease]">
                <p className="text-[11px] text-[#5e6a7a] font-mono">{t('dashboard.search_developers_desc')}</p>
                <SearchInput placeholder={t('dashboard.search_placeholder')} onSearch={handleUserSearch} debounceMs={300} />
                
                <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-2">
                  <InfiniteScroll loadMore={loadMoreUserSearch} hasMore={userSearchHasMore} isLoading={userSearchLoading}>
                    {userSearchResult.length === 0 ? (
                      <p className="text-[11px] text-[#5e6a7a] py-2 text-center italic">{t('dashboard.no_developers_found')}</p>
                    ) : (
                      userSearchResult.map((u) => (
                        <div key={u.id} className="flex items-center justify-between gap-2 p-1.5 rounded hover:bg-[#0d1219]/50 transition-colors">
                          <div className="flex items-center gap-2 min-w-0">
                            {u.avatar ? (
                              <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-full object-cover" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#0a0e14] border border-[#222b38] flex items-center justify-center font-mono text-[9px] text-[#1ec8b5] font-semibold">{u.name.substring(0, 1).toUpperCase()}</div>
                            )}
                            <span className="text-[12px] text-[#9aa5b3] truncate">{u.name}</span>
                          </div>
                          <Button variant="secondary" size="sm" onClick={() => handleSendFriendRequest(u.id)} className="text-[10px] py-1 px-2.5">
                            {t('dashboard.add')}
                          </Button>
                        </div>
                      ))
                    )}
                  </InfiniteScroll>
                </div>
              </div>
            )}

            {/* Standard Friends list with Search and Infinite Scroll */}
            <SearchInput placeholder="Search friends list..." onSearch={handleFriendsSearch} debounceMs={200} />

            <div className="max-h-72 overflow-y-auto pr-1 flex flex-col gap-2.5">
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
      </div>

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
