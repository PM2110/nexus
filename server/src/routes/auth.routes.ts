import { Router } from 'express';
import { signup, login, forgotPassword, resetPassword, getMe, refresh, logout } from '../controllers/auth.controller';
import { googleAuth, googleCallback, githubAuth, githubCallback } from '../controllers/oauth.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticateToken, getMe);

// OAuth Routes
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/github', githubAuth);
router.get('/github/callback', githubCallback);

export default router;
