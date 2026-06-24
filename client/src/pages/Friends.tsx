import React, { useState, useEffect, useCallback } from 'react';
import { friendService } from '../services';
import { SearchInput } from '../components/common/SearchInput';
import { InfiniteScroll } from '../components/common/InfiniteScroll';
import { SpinnerIcon } from '../components/common/Icons';
import type { Friend, FriendRequest } from '../types';

import { Navbar } from '../components/common/Navbar';
import { FriendRequestItem } from '../components/dashboard/FriendRequestItem';
import '../styles/dashboard.css';

export const Friends: React.FC = () => {

  // Add friend state
  const [targetUsername, setTargetUsername] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Friends list state
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendsPage, setFriendsPage] = useState(1);
  const [friendsSearch, setFriendsSearch] = useState('');
  const [hasMoreFriends, setHasMoreFriends] = useState(false);
  const [isLoadingFriends, setIsLoadingFriends] = useState(false);

  // Friend requests state
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);

  // Fetch friends list (paginated)
  const fetchFriends = useCallback(async (searchQuery: string, pageNum: number, append: boolean = false) => {
    setIsLoadingFriends(true);
    try {
      const data = await friendService.getFriends(searchQuery, pageNum, 12);
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

  // Init fetch on load
  useEffect(() => {
    fetchFriends('', 1);
    fetchFriendRequests();
  }, [fetchFriends, fetchFriendRequests]);

  // Listen to custom cross-module updates (e.g. from Navbar)
  useEffect(() => {
    const handleUpdate = () => {
      fetchFriends('', 1);
      fetchFriendRequests();
    };
    window.addEventListener('friend-updated', handleUpdate);
    return () => window.removeEventListener('friend-updated', handleUpdate);
  }, [fetchFriends, fetchFriendRequests]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAddSuccess(null);
    const trimmed = targetUsername.trim();
    if (!trimmed) {
      setAddError('Username is required');
      return;
    }
    if (!trimmed.includes('#')) {
      setAddError('Username must include the # tag (e.g. name#1234)');
      return;
    }
    setIsSubmitting(true);
    try {
      await friendService.sendFriendRequest(undefined, trimmed);
      setAddSuccess(`Friend request sent successfully to ${trimmed}!`);
      setTargetUsername('');
      window.dispatchEvent(new CustomEvent('notifications-updated'));
    } catch (err: any) {
      setAddError(err.response?.data?.message || err.message || 'Failed to send friend request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (friendshipId: number) => {
    try {
      await friendService.acceptFriendRequest(friendshipId);
      fetchFriendRequests();
      fetchFriends(friendsSearch, 1);
      window.dispatchEvent(new CustomEvent('friend-updated'));
    } catch (err: any) {
      alert(err.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (friendshipId: number) => {
    try {
      await friendService.rejectFriendRequest(friendshipId);
      fetchFriendRequests();
      window.dispatchEvent(new CustomEvent('friend-updated'));
    } catch (err: any) {
      alert(err.message || 'Failed to decline request');
    }
  };

  const loadMoreFriends = () => {
    if (!isLoadingFriends && hasMoreFriends) {
      fetchFriends(friendsSearch, friendsPage + 1, true);
    }
  };

  return (
    <div className="page-wrapper min-h-screen bg-[#0a0e14]">
      {/* Background ambient elements */}
      <div className="ambient" />

      {/* Navigation */}
      <Navbar />

      {/* Main Layout Grid */}
      <main className="wrap pb-20 rise" style={{ animationDelay: '.1s' }}>
        <div className="dash-title-row">
          <div>
            <h1 className="dash-title">Developers & Friends</h1>
            <p className="dash-subtitle">Manage connections, view pending invites, and add collaborators</p>
          </div>
        </div>

        {/* TOP SECTION: ADD A NEW FRIEND (FULL WIDTH) */}
        <div className="side-panel" style={{ marginBottom: '24px' }}>
          <div className="side-panel-title">Add a Friend</div>
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
            <p className="add-friend-desc" style={{ marginBottom: 0, flex: '1 1 300px', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              You can add friends with their unique user tag. Type in their name and tag (e.g. <code>username#1234</code>) to send a friend request.
            </p>
            <form onSubmit={handleAddFriend} style={{ display: 'flex', gap: '12px', flex: '1 1 400px', maxWidth: '600px' }}>
              <input
                type="text"
                placeholder="e.g. mananpatel#4009"
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                className="field-input font-mono"
                style={{ flex: 1, marginBottom: 0 }}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting || !targetUsername.trim()}
                className="btn btn-primary"
                style={{ flexShrink: 0, padding: '0 24px', height: '42px', justifyContent: 'center' }}
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>
          {addError && <div className="form-error" style={{ marginTop: '12px' }}>{addError}</div>}
          {addSuccess && <div className="form-success" style={{ marginTop: '12px' }}>{addSuccess}</div>}
        </div>

        {/* BOTTOM SECTION: SIDE-BY-SIDE 2 COLUMNS */}
        <div className="friends-bottom-grid">
          {/* COLUMN 1: ACTIVE CONNECTIONS WITH SCROLLBAR */}
          <div className="side-panel" style={{ minHeight: '400px', marginBottom: 0 }}>
            <div className="friends-header-row">
              <div className="side-panel-title" style={{ fontSize: '0.98rem' }}>
                Active Connections ({friends.length})
              </div>
              <div style={{ width: '250px' }}>
                <SearchInput
                  placeholder="Search by name..."
                  onSearch={(val) => {
                    setFriendsSearch(val);
                    fetchFriends(val, 1);
                  }}
                  debounceMs={250}
                />
              </div>
            </div>

            {isLoadingFriends && friends.length === 0 ? (
              <div className="flex flex-col gap-4 py-20 items-center justify-center">
                <SpinnerIcon size={32} className="text-[#1ec8b5] animate-spin" />
                <span className="text-xs text-[#5e6a7a] font-mono">Fetching friends list...</span>
              </div>
            ) : friends.length === 0 ? (
              <div className="empty-state" style={{ padding: '60px 20px', borderStyle: 'solid', marginTop: '20px' }}>
                <div className="empty-icon">
                  <svg style={{ width: '20px', height: '20px' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3>No friends found</h3>
                <p>
                  {friendsSearch
                    ? 'No friends matching your search criteria.'
                    : 'You haven\'t added any friends yet. Invite other developers using their user tag!'}
                </p>
              </div>
            ) : (
              <div className="friends-scroll-container">
                <InfiniteScroll
                  loadMore={loadMoreFriends}
                  hasMore={hasMoreFriends}
                  isLoading={isLoadingFriends}
                  className="friends-list-grid"
                  loader={<div className="text-center py-2 text-xs text-[#5e6a7a] col-span-full">Loading more...</div>}
                >
                  {friends.map((f) => (
                    <div key={f.id} className="friends-active-card">
                      <div className="friend-card-avatar">
                        {f.avatar ? (
                          <img src={f.avatar} alt={f.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          f.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="friend-card-info">
                        <div className="friend-card-name" title={f.name}>{f.name}</div>
                        <div className="friend-card-email" title={f.username || f.email}>{f.username || f.email}</div>
                      </div>
                      <div className="friend-online" style={{ marginLeft: '4px' }} />
                    </div>
                  ))}
                </InfiniteScroll>
              </div>
            )}
          </div>

          {/* COLUMN 2: PENDING REQUESTS */}
          <div className="side-panel" style={{ marginBottom: 0 }}>
            <div className="side-panel-title">
              {friendRequests.length > 0 && <span className="glow-dot danger" />}
              Pending Requests ({friendRequests.length})
            </div>
            {isLoadingRequests ? (
              <div className="text-center py-4">
                <SpinnerIcon size={18} className="animate-spin text-[#1ec8b5] mx-auto" />
              </div>
            ) : friendRequests.length === 0 ? (
              <p className="text-xs text-[#5e6a7a] text-center italic py-2">No pending invitations</p>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {friendRequests.map((req) => (
                  <FriendRequestItem
                    key={req.friendshipId}
                    request={req}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
