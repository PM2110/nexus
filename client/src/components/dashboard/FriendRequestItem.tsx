import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { CheckIcon, CloseIcon } from '../common/Icons';

interface FriendRequestItemProps {
  request: any;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}

export const FriendRequestItem: React.FC<FriendRequestItemProps> = ({
  request,
  onAccept,
  onReject
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between gap-3 bg-[#131a24]/50 border border-[#222b38]/50 p-2.5 rounded-lg">
      <div className="flex items-center gap-2 min-w-0">
        {request.sender.avatar ? (
          <img
            src={request.sender.avatar}
            alt={request.sender.name}
            className="w-7 h-7 rounded-full object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-[#0d1219] border border-[#222b38] flex items-center justify-center font-mono text-[9px] text-[#1ec8b5]">
            {request.sender.name.substring(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-[12px] text-white font-medium truncate">{request.sender.name}</p>
          <p className="text-[10px] text-[#5e6a7a] truncate">{t('dashboard.wants_to_be_friends')}</p>
        </div>
      </div>
      <div className="flex gap-1.5 flex-shrink-0">
        <button
          onClick={() => onAccept(request.friendshipId)}
          className="w-6 h-6 rounded bg-[#1ec8b5]/10 hover:bg-[#1ec8b5] text-[#1ec8b5] hover:text-[#0a0e14] border border-[#1ec8b5]/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <CheckIcon size={12} />
        </button>
        <button
          onClick={() => onReject(request.friendshipId)}
          className="w-6 h-6 rounded bg-[#e0596b]/10 hover:bg-[#e0596b] text-[#e0596b] hover:text-white border border-[#e0596b]/20 flex items-center justify-center transition-colors cursor-pointer"
        >
          <CloseIcon size={12} />
        </button>
      </div>
    </div>
  );
};
