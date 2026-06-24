import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { friendService } from '../services';
import { SearchInput } from '../components/common/SearchInput';
import { InfiniteScroll } from '../components/common/InfiniteScroll';
import { SpinnerIcon } from '../components/common/Icons';
import type { Friend, FriendRequest } from '../types';

import { Navbar } from '../components/common/Navbar';
import { FriendRequestItem } from '../components/dashboard/FriendRequestItem';
import '../styles/dashboard.css';

export const Friends: React.FC = () => {
  const { user } = useAuth();

  // User identity tag copied state
  const [copied, setCopied] = useState(false);

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

  const handleCopyUsername = () => {
    if (user?.username) {
      navigator.clipboard.writeText(user.username);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

      {/* Friends Header */}
      <div className="wrap dash-header">
        <div className="dash-eyebrow rise" style={{ animationDelay: '.05s' }}>
          <span className="glow-dot" /> CONNECTIVITY ACTIVE
        </div>
      </div>

      {/* Main Layout Grid */}
      <main className="wrap pb-20 rise" style={{ animationDelay: '.1s' }}>
        <div className="dash-title-row">
          <div>
            <h1 className="dash-title">Developers & Friends</h1>
            <p className="dash-subtitle">Manage connections, view pending invites, and add collaborators</p>
          </div>
        </div>

        <div className="friends-grid">
          {/* LEFT SIDEBAR: PROFILE CARD & ADD FRIEND FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* My Identity Card */}
            <div className="side-panel">
              <div className="side-panel-title">
                <span className="glow-dot" /> Your Identity Code
              </div>
              <div className="identity-card-inner">
                <div className="identity-avatar">
                  {user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                </div>
                <div className="identity-info">
                  <div className="identity-name">{user?.name}</div>
                  <div className="identity-email">{user?.email}</div>
                </div>
                {user?.username && (
                  <div className="share-tag-container">
                    <div className="share-tag-label">SHARE YOUR TAG</div>
                    <div className="share-tag-box">
                      <span className="share-tag-text">{user.username}</span>
                      <button onClick={handleCopyUsername} className="copy-tag-btn">
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Friend Box */}
            <div className="side-panel">
              <div className="side-panel-title">Add a Friend</div>
              <p className="add-friend-desc" style={{ marginBottom: '12px' }}>
                Type in the full name and tag to send a request.
              </p>
              <form onSubmit={handleAddFriend} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g. mananpatel#4009"
                  value={targetUsername}
                  onChange={(e) => setTargetUsername(e.target.value)}
                  className="field-input font-mono"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !targetUsername.trim()}
                  className="btn btn-primary"
                  style={{ justifyContent: 'center', width: '100%' }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Friend Request'}
                </button>
              </form>
              {addError && <div className="form-error" style={{ marginTop: '10px' }}>{addError}</div>}
              {addSuccess && <div className="form-success" style={{ marginTop: '10px' }}>{addSuccess}</div>}
            </div>

            {/* Pending Requests Box */}
            <div className="side-panel">
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
                <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto pr-1">
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

          {/* RIGHT CONTENT AREA: FRIENDS DIRECTORY */}
          <div className="side-panel" style={{ minHeight: '400px', marginBottom: 0 }}>
            <div className="friends-header-row">
              <div className="side-panel-title" style={{ fontSize: '0.98rem' }}>Active Connections</div>
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
              <div className="friends-list-grid">
                <InfiniteScroll
                  loadMore={loadMoreFriends}
                  hasMore={hasMoreFriends}
                  isLoading={isLoadingFriends}
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
        </div>
      </main>
    </div>
  );
};
