import { apiClient } from './apiClient';

export interface Notification {
  id: number;
  userId: number;
  type: 'WORKSPACE_INVITE' | 'FRIEND_REQUEST';
  title: string;
  content: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get<{ notifications: Notification[] }>('/notifications');
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await apiClient.patch<{ message: string }>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.post<{ message: string }>('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (id: number) => {
    const response = await apiClient.delete<{ message: string }>(`/notifications/${id}`);
    return response.data;
  },
};
