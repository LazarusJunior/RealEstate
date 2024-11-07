import { Router } from 'express';
import { getUserProfile, getUserInvestments } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();

// User dashboard routes
router.get('/dashboard/profile', authenticateJWT, getUserProfile); // Get user profile
router.get('/dashboard/investments', authenticateJWT, getUserInvestments); // Get user investments

export default router;
