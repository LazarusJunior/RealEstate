import { Request, Response } from 'express';
import prisma from '../config/database';
import { hashPassword, comparePasswords, generateToken } from '../utils/authUtils';

export const register = async (req: Request, res: Response) => {
  try {
  
      const { name, email, password } = req.body;
      const passwordHash = await hashPassword(password); 
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
           res.status(400).json({ error: 'User already exists' });
           return}
     
      // Create user in the database
      const user = await prisma.user.create({
          data: {
              name,
              email,
              passwordHash,
          },
      });

      const token = generateToken(user.id, user.role); 

      // Set the token in a cookie
      res.cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Set secure in production
          maxAge: 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      });

      res.status(201).json({ message: 'Registration successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Error registering user' });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.error('User not found:', email);
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const isPasswordValid = await comparePasswords(password, user.passwordHash); 
        if (!isPasswordValid) {
            console.error('Invalid password for user:', email);
            res.status(401).json({ error: 'Invalid email or password' });
            return;
        }

        const token = generateToken(user.id, user.role); 
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Error logging in user' });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Error fetching users' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({ where: { id: Number(id) } });

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ error: 'Error fetching user by ID' });
    }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
      const { id } = req.params;
      const { name, email, password } = req.body;

      //Find the existing user
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      if (!user) {
           res.status(404).json({ error: 'User not found' });
           return
          }

      //Check if the new email is already in use
      if (email && email !== user.email) {
          const existingUser = await prisma.user.findUnique({ where: { email } });
          if (existingUser) {
               res.status(400).json({ error: 'Email is already in use' });
               return
              }
      }

      //Prepare updated data
      const updatedData: any = { name, email };
      if (password) {
          updatedData.passwordHash = await hashPassword(password);
      }

      //  Update the user
      const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: updatedData,
      });

      res.status(200).json({
          message: 'User updated successfully',
          updatedUser,
      });
  } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Error updating user' });
  }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

export const assignAdmin = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const user = await prisma.user.findUnique({ where: { id: Number(id) } });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { role: 'ADMIN' },
        });

        res.status(200).json({ message: `User ${updatedUser.name} is now an admin`, user: updatedUser });
    } catch (error) {
        console.error('Error assigning admin role:', error);
        res.status(500).json({ error: 'Error assigning admin role' });
    }
};
