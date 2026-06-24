import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { Button } from './Button';
import { BrandIcon } from './Icons';
import { notificationService, friendService } from '../../services';
import type { Notification } from '../../services/notificationService';
import '../../styles/navbar.css';

interface NavbarProps {
  activeSection?: string;
  onNavClick?: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavClick,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data.notifications);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      fetchNotifications();
    };
    window.addEventListener('friend-updated', handleUpdate);
    window.addEventListener('notifications-updated', handleUpdate);
    return () => {
      window.removeEventListener('friend-updated', handleUpdate);
      window.removeEventListener('notifications-updated', handleUpdate);
    };
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  const handleDeleteNotification = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      fetchNotifications();
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleAcceptFriendBySenderName = async (senderName: string, notificationId: number) => {
    try {
      const data = await friendService.getFriendRequests();
      const match = data.requests.find((r) => r.sender.name === senderName);
      if (match) {
        await friendService.acceptFriendRequest(match.friendshipId);
      }
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
      window.dispatchEvent(new CustomEvent('friend-updated'));
    } catch (err: any) {
      alert(err.message || 'Failed to accept friend request');
    }
  };

  const handleRejectFriendBySenderName = async (senderName: string, notificationId: number) => {
    try {
      const data = await friendService.getFriendRequests();
      const match = data.requests.find((r) => r.sender.name === senderName);
      if (match) {
        await friendService.rejectFriendRequest(match.friendshipId);
      }
      await notificationService.markAsRead(notificationId);
      fetchNotifications();
      window.dispatchEvent(new CustomEvent('friend-updated'));
    } catch (err: any) {
      alert(err.message || 'Failed to decline friend request');
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const handleBrandClick = () => {
    if (isHomePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  const navClassName = isHomePage
    ? `nav-bar ${isScrolled ? 'nav-bar-scrolled' : 'nav-bar-transparent'}`
    : 'app-nav';

  const containerClassName = 'wrap nav-inner';

  return (
    <nav className={navClassName}>
      <div className={containerClassName}>
        <div className="brand" onClick={handleBrandClick}>
          <BrandIcon size={26} className="brand-mark" />
          <span className="brand-name">{t('common.brand')}</span>
        </div>

        <div className="nav-links">
          {isAuthenticated ? (
            // Logged In Navigation Options
            <>
              {isHomePage ? (
                <>
                  <a
                    href="#features"
                    onClick={(e) => onNavClick?.(e, 'features')}
                    className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.features')}
                  </a>
                  <a
                    href="#workspaces"
                    onClick={(e) => onNavClick?.(e, 'workspaces')}
                    className={`nav-link ${activeSection === 'workspaces' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.workspaces')}
                  </a>
                  <a
                    href="#workflow"
                    onClick={(e) => onNavClick?.(e, 'workflow')}
                    className={`nav-link ${activeSection === 'workflow' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('nav.how_it_works')}
                  </a>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/dashboard')}
                    className="text-xs py-1.5 px-3 border-[#1ec8b5]/20 text-[#1ec8b5] hover:bg-[#1ec8b5]/5 hover:border-[#1ec8b5]"
                  >
                    Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className={`nav-link ${location.pathname === '/dashboard' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('dashboard.nav_workspaces')}
                  </button>
                  <button
                    onClick={() => navigate('/friends')}
                    className={`nav-link ${location.pathname === '/friends' ? 'nav-link-active' : 'nav-link-inactive'}`}
                  >
                    {t('dashboard.nav_friends')}
                  </button>
                </>
              )}

              <div className="flex items-center gap-4">
                {/* Notifications Dropdown */}
                <div className="relative flex items-center" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="relative p-1.5 rounded-lg text-[#9aa5b3] hover:text-white hover:bg-[#131a24] border border-[#222b38] transition-all cursor-pointer flex items-center justify-center"
                    style={{ background: 'none' }}
                  >
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#e0596b] text-white text-[8.5px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotifOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-80 bg-[#0d1219] border border-[#222b38] rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-[#222b38] flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-white font-mono uppercase tracking-wider">Notifications</span>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[10px] text-[#1ec8b5] hover:underline font-mono bg-transparent border-none cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-[#222b38]/40">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-[#5e6a7a] text-xs italic">
                            No notifications
                          </div>
                        ) : (
                          notifications.map((notif) => {
                            const senderName = notif.content.split(' sent you a friend request')[0];
                            return (
                              <div key={notif.id} className={`p-3 text-left hover:bg-[#131a24]/50 transition-colors ${!notif.isRead ? 'bg-[#131a24]/30' : ''}`}>
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-[11px] font-semibold text-white">{notif.title}</span>
                                  <div className="flex items-center gap-1.5">
                                    {!notif.isRead && (
                                      <button
                                        onClick={() => handleMarkRead(notif.id)}
                                        className="w-1.5 h-1.5 bg-[#1ec8b5] rounded-full hover:scale-125 transition-transform border-none cursor-pointer p-0"
                                        title="Mark as read"
                                      />
                                    )}
                                    <button
                                      onClick={() => handleDeleteNotification(notif.id)}
                                      className="text-[#5e6a7a] hover:text-[#e0596b] text-[13px] bg-transparent border-none cursor-pointer font-bold leading-none p-0"
                                      title="Dismiss"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                </div>
                                <p className="text-[11px] text-[#9aa5b3] mt-1 leading-relaxed">{notif.content}</p>

                                {notif.type === 'FRIEND_REQUEST' && !notif.isRead && (
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() => handleAcceptFriendBySenderName(senderName, notif.id)}
                                      className="px-2.5 py-1 bg-[#1ec8b5] text-[#0a0e14] text-[9.5px] font-bold rounded hover:bg-[#28d6c2] transition-colors border-none cursor-pointer"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => handleRejectFriendBySenderName(senderName, notif.id)}
                                      className="px-2.5 py-1 bg-[#e0596b]/10 text-[#e0596b] border border-[#e0596b]/20 text-[9.5px] font-bold rounded hover:bg-[#e0596b]/20 transition-colors cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                  </div>
                                )}

                                {notif.type === 'WORKSPACE_INVITE' && notif.link && (
                                  <div className="mt-2">
                                    <button
                                      onClick={() => {
                                        handleMarkRead(notif.id);
                                        setIsNotifOpen(false);
                                        navigate(notif.link!);
                                      }}
                                      className="px-2.5 py-1 bg-[#1ec8b5]/10 text-[#1ec8b5] border border-[#1ec8b5]/25 text-[9.5px] font-bold rounded hover:bg-[#1ec8b5]/20 transition-colors cursor-pointer"
                                    >
                                      Join Workspace
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="p-0 bg-transparent border-none cursor-pointer focus:outline-none flex items-center"
                    style={{ background: 'none' }}
                  >
                    <div className="nav-avatar">
                      <div className="nav-avatar-inner">
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                          />
                        ) : (
                          user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
                        )}
                      </div>
                    </div>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 top-full mt-2.5 w-48 bg-[#0d1219] border border-[#222b38] rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                      <div className="px-4 py-2 border-b border-[#222b38]/40">
                        <div className="text-[11px] font-semibold text-white truncate">{user?.name}</div>
                        <div className="text-[9px] text-[#5e6a7a] truncate font-mono mt-0.5">{user?.email}</div>
                      </div>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          navigate('/friends');
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#9aa5b3] hover:text-[#1ec8b5] hover:bg-[#131a24]/60 transition-colors bg-transparent border-none cursor-pointer font-mono flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#e0596b] hover:bg-[#e0596b]/10 transition-colors bg-transparent border-none cursor-pointer font-mono flex items-center gap-2"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            // Logged Out Navigation Options
            <>
              <a
                href="#features"
                onClick={(e) => onNavClick?.(e, 'features')}
                className={`nav-link ${activeSection === 'features' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.features')}
              </a>
              <a
                href="#workspaces"
                onClick={(e) => onNavClick?.(e, 'workspaces')}
                className={`nav-link ${activeSection === 'workspaces' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.workspaces')}
              </a>
              <a
                href="#workflow"
                onClick={(e) => onNavClick?.(e, 'workflow')}
                className={`nav-link ${activeSection === 'workflow' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('nav.how_it_works')}
              </a>
              <button
                onClick={() => navigate('/login')}
                className={`nav-link danger ${location.pathname === '/login' ? 'nav-link-active' : 'nav-link-inactive'}`}
              >
                {t('common.sign_in')}
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/login')}
              >
                {t('common.start_session')}
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
