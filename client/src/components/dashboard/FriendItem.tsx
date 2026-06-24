import React from 'react';

interface FriendItemProps {
  friend: any;
}

export const FriendItem: React.FC<FriendItemProps> = ({ friend }) => {
  return (
    <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-[#131a24]/30 border border-transparent hover:border-[#222b38]/30 transition-all duration-300">
      {friend.avatar ? (
        <img
          src={friend.avatar}
          alt={friend.name}
          className="w-8 h-8 rounded-full border border-[#222b38] object-cover"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-[#131a24] border border-[#222b38] flex items-center justify-center font-mono text-xs text-[#1ec8b5] font-semibold">
          {friend.name.substring(0, 1).toUpperCase()}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-white truncate">{friend.name}</p>
        <p className="text-[10px] text-[#5e6a7a] truncate font-mono">{friend.email}</p>
      </div>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 mr-1 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
    </div>
  );
};
