import { Router } from 'express';
import { register, login, getUsers, getUserById } from '../controllers/authController';

const router = Router();

// Define the routes
router.post('/register', register);
router.post('/login', login);
router.get('/getUsers', getUsers);
router.get('/getUserById/:id',getUserById);

export default router;
