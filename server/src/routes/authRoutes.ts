import { Router } from 'express';
import { register, login, getUsers, getUserById, updateUser, deleteUser, assignAdmin } from '../controllers/authController';
import {  userRegistrationValidator } from '../middleware/validators';

const router = Router();

// Define the routes
router.post('/register', userRegistrationValidator,  register);
router.post('/login', login);
router.get('/getUsers', getUsers);
router.get('/getUserById/:id',getUserById);
router.patch('/updateUser/:id', userRegistrationValidator,updateUser);
router.delete('/deleteUser/:id',deleteUser);
router.post('/assignAdmin/:id',assignAdmin);

export default router;
