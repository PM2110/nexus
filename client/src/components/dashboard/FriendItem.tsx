import React from 'react';

interface FriendItemProps {
  friend: any;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  return (
    <div className="friend-row">
      {friend.avatar ? (
        <img
          src={friend.avatar}
          alt={friend.name}
          className="friend-avatar object-cover"
        />
      ) : (
        <div className="friend-avatar">
          {friend.name.substring(0, 2).toUpperCase()}
        </div>
      )}
      <div>
        <div className="friend-name">{friend.name}</div>
        <div className="friend-email">{friend.email}</div>
      </div>
      <div className="friend-online" />
    </div>
  );
};

