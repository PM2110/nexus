export interface Friend {
  friendshipId: number;
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface FriendRequest {
  friendshipId: number;
  sender: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
}

export interface SearchUsersResult {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
