import { Request, Response } from 'express';
import prisma from '../config/database';

export const createInvestment = async (req: any, res: Response) => {
    const { propertyId, amount } = req.body;
    const userId = req.user?.id;
  
    try {
      // Ensure the property exists
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property) {
         res.status(404).json({ error: 'Property not found' });
         return
        }
  
      // Create investment
      const investment = await prisma.investment.create({
        data: { amount, userId, propertyId },
      });
  
      // Log the transaction for this investment
      await prisma.transaction.create({
        data: {
          userId,
          type: 'Investment',
          amount,
        },
      });
  
      res.status(201).json({ message: 'Investment created successfully', investment });
    } catch (error) {
      console.error('Error creating investment:', error);
      res.status(500).json({ error: 'Error creating investment' });
    }
  };
  
// View Investments (User-specific)
export const getUserInvestments = async (req: any, res: Response) => {
  const userId = req.user?.id;

  try {
    const investments = await prisma.investment.findMany({
      where: { userId },
      include: { property: true },
    });
    res.status(200).json(investments);
  } catch (error) {
    console.error('Error fetching investments:', error);
    res.status(500).json({ error: 'Error fetching investments' });
  }
};

// View All Investments (Admin-only)
export const getAllInvestments = async (req: Request, res: Response) => {
  try {
    const investments = await prisma.investment.findMany({ include: { user: true, property: true } });
    res.status(200).json(investments);
  } catch (error) {
    console.error('Error fetching all investments:', error);
    res.status(500).json({ error: 'Error fetching investments' });
  }
};


// Update Investment
export const updateInvestment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const investment = await prisma.investment.update({
      where: { id: Number(id) },
      data: { amount },
    });
    res.status(200).json({ message: 'Investment updated successfully', investment });
  } catch (error) {
    console.error('Error updating investment:', error);
    res.status(500).json({ error: 'Error updating investment' });
  }
};

// Delete Investment
export const deleteInvestment = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        //Check if the investment exists
        const investment = await prisma.investment.findUnique({
            where: { id: Number(id) },
        });

        if (!investment) {
             res.status(404).json({ message: 'Investment not found' });
             return
            }

        //Delete the investment
        await prisma.investment.delete({
            where: { id: Number(id) },
        });

        res.status(200).json({ message: 'Investment deleted successfully' });
    } catch (error) {
        console.error('Error deleting investment:', error);
        res.status(500).json({ error: 'Error deleting investment' });
    }
};

export const getUserInvestmentHistory = async (req: any, res: Response) => {
    const userId = req.user?.id;
  
    try {
      const investments = await prisma.investment.findMany({
        where: { userId },
        include: {
          property: true, // Include the property details for each investment
        },
      });
  
      if (investments.length === 0) {
        return res.status(404).json({ error: 'No investments found for this user' });
      }
  
      const investmentsWithOwnership = investments.map(investment => {
        const ownershipPercentage = (Number(investment.amount) / Number(investment.property.targetInvestment)) * 100;
  
        return {
          investmentId: investment.id,
          propertyName: investment.property.name,
          investmentAmount: investment.amount,
          ownershipPercentage: ownershipPercentage.toFixed(2),
          createdAt: investment.createdAt,
        };
      });
  
      res.status(200).json(investmentsWithOwnership);
    } catch (error) {
      console.error('Error fetching user investments:', error);
      res.status(500).json({ error: 'Error fetching user investments' });
    }
  };
  