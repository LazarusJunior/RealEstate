import { Router } from 'express';
import { createInvestment, getUserInvestments, getAllInvestments, updateInvestment, deleteInvestment } from '../controllers/investmentController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminCheck } from '../middleware/adminCheck';

const router = Router();

// Investment routes with audit logging
router.post('/createInvestment', authenticateJWT,  createInvestment);
router.get('/investments/user', authenticateJWT,  getUserInvestments); 
router.get('/getAllInvestments', authenticateJWT, adminCheck,  getAllInvestments); // Admin only
router.patch('/updateInvestment/:id', authenticateJWT,  updateInvestment); 
router.delete('/deleteInvestment/:id', authenticateJWT,  deleteInvestment); 

export default router;
