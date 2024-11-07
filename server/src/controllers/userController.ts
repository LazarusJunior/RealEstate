import { Request, Response } from 'express';
import prisma from '../config/database';

// Get user profile for user dashboard
export const getUserProfile = async (req: any, res: Response) => {
  const userId = req.user.id; 
  

  try {
    const userProfile = await prisma.user.findUnique({
      where: { id: userId },
      include: { investments: true }, // Include investments in profile
    });

    if (!userProfile) {
       res.status(404).json({ message: 'User not found' });
       return
    }

    res.status(200).json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get user's investments for user dashboard
export const getUserInvestments = async (req: any, res: Response) => {
  const userId = req.user.id;

  try {
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: {
        property: true, // Include property details for each investment
      },
    });

    res.status(200).json(investments);
  } catch (error) {
    console.error('Error fetching user investments:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
