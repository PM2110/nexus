import { Router } from 'express';
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUsersToRequest,
} from '../controllers/friend.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All friends routes require authentication
router.get('/', authenticateToken, getFriends);
router.get('/requests', authenticateToken, getFriendRequests);
router.post('/request', authenticateToken, sendFriendRequest);
router.post('/accept', authenticateToken, acceptFriendRequest);
router.post('/reject', authenticateToken, rejectFriendRequest);
router.get('/search-users', authenticateToken, searchUsersToRequest);

export default router;
