import { Router } from 'express';
import { register, login, getUsers, getUserById, updateUser, deleteUser, assignAdmin, logoutUser } from '../controllers/authController';
import { updateUserValidator, userRegistrationValidator } from '../middleware/validators';
import { adminCheck } from '../middleware/adminCheck';
import { authenticateJWT } from '../middleware/authMiddleware';
import { Request, Response } from 'express';
import { log } from 'console';

const router = Router();

// Define the routes
router.post('/register', userRegistrationValidator, register);
router.post('/login', login);
router.post('/logout', logoutUser);
router.get('/getUsers', getUsers);
router.get('/getUserById/:id', getUserById);
router.patch('/updateUser/:id', updateUserValidator, updateUser);
router.delete('/deleteUser/:id', deleteUser);
router.post('/assignAdmin/:id', assignAdmin);



export default router;
