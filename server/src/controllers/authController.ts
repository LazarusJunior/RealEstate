import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
  
      // Find the user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });
  
      // Handle case where user is not found
      if (!user) {
        console.error('User not found:', email);
        res.status(401).json({ error: 'Invalid email or password' });
        return; // Exit the function after sending the response
      }
  
      // Compare the password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      
      if (!isPasswordValid) {
        console.error('Invalid password for user:', email);
        res.status(401).json({ error: 'Invalid email or password' });
        return; // Exit the function after sending the response
      }
  
      // Generate a JWT token
      const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      
      // Successful login
      res.status(200).json({ message: 'Login successful',token });
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
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

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

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const updatedData: any = { name, email };
  if (password) {
    const saltRounds = 10;
    updatedData.passwordHash = await bcrypt.hash(password, saltRounds);
  }

  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: updatedData,
  });

  res.status(200).json(updatedUser);
} catch (error) {
  console.error('Error updating user:', error);
  res.status(500).json({ error: 'Error updating user' });
}
};
 
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};

export const assignAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: 'ADMIN' },
    });

    res.status(200).json({ message:  `User ${updatedUser.name} is now an admin`, user: updatedUser });
  } catch (error) {
    console.error('Error assigning admin role:', error);
    res.status(500).json({ error: 'Error assigning admin role' });
  }
};