export interface Workspace {
  id: string;
  name: string;
  inviteCode: string;
  problemUrl?: string;
  problemPlatform?: string;
  createdAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  membersCount?: number;
  myRole?: string;
}

export interface CreateWorkspaceParams {
  name: string;
  problemUrl?: string;
  problemPlatform?: string;
  invitedFriends?: string[];
}
