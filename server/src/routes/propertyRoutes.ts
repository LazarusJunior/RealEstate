import { Router } from 'express';
import { createProperty, deleteProperty, getProperties, getPropertyById, updateProperty } from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/authMiddleware';
import { adminCheck } from '../middleware/adminCheck';
import { getPropertyPerformance } from '../controllers/reportController';


const router = Router();

router.post('/createProperty', authenticateJWT, adminCheck,  createProperty); // Create property
router.patch('/updateProperty/:id', authenticateJWT, adminCheck, updateProperty); // Update property
router.delete('/deleteProperty/:id', authenticateJWT, adminCheck,  deleteProperty); // Delete property


router.get('/getProperties', getProperties);// View all properties
router.get('/getPropertyById/:id', getPropertyById);// View a property ny ID
// Property Performance
router.get('/admin/properties/performance', authenticateJWT, adminCheck, getPropertyPerformance);



export default router;
