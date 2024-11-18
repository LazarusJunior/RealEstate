import { Router } from 'express';
import { getUsers,  } from '../controllers/authController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminCheck } from '../middleware/adminCheck';
import { getAllInvestments } from '../controllers/investmentController';
import { getProperties } from '../controllers/propertyController';

const router = Router();

// Admin dashboard routes
router.get('/dashboard/users', authenticateJWT, adminCheck, getUsers); // Get all users
router.get('/dashboard/investments', authenticateJWT, adminCheck, getAllInvestments); // Get all investments
router.get('/dashboard/properties', authenticateJWT, adminCheck, getProperties); // Get all properties

export default router;
