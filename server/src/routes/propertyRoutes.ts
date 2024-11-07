import { Router } from 'express';
import { createProperty, deleteProperty, getProperties, getPropertyById, updateProperty } from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminCheck } from '../middleware/adminCheck';
import { auditLogMiddleware } from '../middleware/auditLogMiddleware';
import { getPropertyPerformance } from '../controllers/reportController';


const router = Router();

// This route requires authentication
router.post('/createProperty', authenticateJWT, adminCheck, auditLogMiddleware, createProperty); // Create property
router.patch('/updateProperty/:id', authenticateJWT, adminCheck, auditLogMiddleware, updateProperty); // Update property
router.delete('/deleteProperty/:id', authenticateJWT, adminCheck, auditLogMiddleware, deleteProperty); // Delete property


router.get('/getProperties', getProperties);// View all properties
router.get('/getPropertyById/:id', getPropertyById);// View a property ny ID
// Property Performance
router.get('/admin/properties/performance', authenticateJWT, adminCheck, getPropertyPerformance);



export default router;
