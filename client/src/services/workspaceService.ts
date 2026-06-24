import { apiClient } from './apiClient';
import type { Workspace, CreateWorkspaceParams } from '../types';

export const workspaceService = {
  createWorkspace: async (params: CreateWorkspaceParams) => {
    const response = await apiClient.post<{
      message: string;
      workspace: Workspace;
      defaultSheetId: string;
    }>('/workspaces', params);
    return response.data;
  },

  getWorkspaces: async () => {
    const response = await apiClient.get<{ workspaces: Workspace[] }>('/workspaces');
    return response.data;
  },

  getWorkspaceById: async (id: string) => {
    const response = await apiClient.get<{ workspace: any }>(`/workspaces/${id}`);
    return response.data;
  },

  joinWorkspace: async (inviteCode: string) => {
    const response = await apiClient.post<{ message: string; workspaceId: string }>('/workspaces/join', {
      inviteCode,
    });
    return response.data;
  },

  getInviteDetails: async (inviteCode: string) => {
    const response = await apiClient.get<{
      workspace: { id: string; name: string; ownerName: string; ownerAvatar?: string };
    }>(`/workspaces/invite/${inviteCode}`);
    return response.data;
  },
};
