import { apiClient } from './apiClient';
import type { Friend, FriendRequest, SearchUsersResult } from '../types';

export const friendService = {
  getFriends: async (search: string = '', page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{
      friends: Friend[];
      totalCount: number;
      page: number;
      limit: number;
      hasMore: boolean;
    }>('/friends', {
      params: { search, page, limit },
    });
    return response.data;
  },

  getFriendRequests: async () => {
    const response = await apiClient.get<{ requests: FriendRequest[] }>('/friends/requests');
    return response.data;
  },

  sendFriendRequest: async (friendId?: string, username?: string) => {
    const response = await apiClient.post<{
      message: string;
      friendshipId: number;
      status: string;
    }>('/friends/request', { friendId, username });
    return response.data;
  },

  acceptFriendRequest: async (friendshipId: number) => {
    const response = await apiClient.post<{ message: string }>('/friends/accept', {
      friendshipId,
    });
    return response.data;
  },

  rejectFriendRequest: async (friendshipId: number) => {
    const response = await apiClient.post<{ message: string }>('/friends/reject', {
      friendshipId,
    });
    return response.data;
  },

  searchUsersToRequest: async (search: string = '', page: number = 1, limit: number = 10) => {
    const response = await apiClient.get<{
      users: SearchUsersResult[];
      totalCount: number;
      page: number;
      limit: number;
      hasMore: boolean;
    }>('/friends/search-users', {
      params: { search, page, limit },
    });
    return response.data;
  },
};
