import { Router } from 'express';
import { createProperty, deleteProperty, getProperties, getPropertyById, updateProperty } from '../controllers/propertyController';
import { authenticateJWT } from '../middleware/authMiddleware';


const router = Router();

// This route requires authentication
router.post('/createProperty', authenticateJWT, createProperty);

router.get('/getProperties', getProperties);
router.get('/getPropertyById/:id', getPropertyById);

router.patch('/updateProperty/:id', authenticateJWT, updateProperty);
router.delete('/deleteProperty/:id', authenticateJWT, deleteProperty);

export default router;
