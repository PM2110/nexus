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
    <div className="req-row">
      <div className="req-user">
        {request.sender.avatar ? (
          <img
            src={request.sender.avatar}
            alt={request.sender.name}
            className="req-avatar object-cover"
          />
        ) : (
          <div className="req-avatar">
            {request.sender.name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div className="req-user-name">{request.sender.name}</div>
          <div className="req-user-sub">{t('dashboard.wants_to_be_friends')}</div>
        </div>
      </div>
      <div className="req-actions">
        <button
          onClick={() => onAccept(request.friendshipId)}
          className="req-btn req-accept"
        >
          <CheckIcon size={13} />
        </button>
        <button
          onClick={() => onReject(request.friendshipId)}
          className="req-btn req-reject"
        >
          <CloseIcon size={13} />
        </button>
      </div>
    </div>
  );
};

