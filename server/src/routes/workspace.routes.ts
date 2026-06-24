import { Router } from 'express';
import {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  joinWorkspaceByCode,
  getWorkspaceByInviteCode,
} from '../controllers/workspace.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// All workspace routes require authentication
router.post('/', authenticateToken, createWorkspace);
router.get('/', authenticateToken, getWorkspaces);
router.post('/join', authenticateToken, joinWorkspaceByCode);
router.get('/:id', authenticateToken, getWorkspaceById);
router.get('/invite/:inviteCode', authenticateToken, getWorkspaceByInviteCode);

export default router;
