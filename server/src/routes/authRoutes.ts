import { Router } from 'express';
import { register, login, getUsers, getUserById } from '../controllers/authController';
import { userRegistrationValidator } from '../middleware/validators';

const router = Router();

// Define the routes
router.post('/register', userRegistrationValidator,  register);
router.post('/login', login);
router.get('/getUsers', getUsers);
router.get('/getUserById/:id',getUserById);

export default router;
