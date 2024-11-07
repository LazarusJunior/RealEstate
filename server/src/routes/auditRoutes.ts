import { Router } from 'express';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminCheck } from '../middleware/adminCheck';
import { getAuditLogs } from '../controllers/auditFetchController';

const router = Router();

// Admin-only route to view audit logs
router.get('/admin/auditLogs', authenticateJWT, adminCheck, getAuditLogs);

export default router;
