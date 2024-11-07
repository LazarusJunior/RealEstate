import { Request, Response } from 'express';
import prisma from '../config/database';  

// Get Property Performance (for the admin dashboard)
export const getPropertyPerformance = async (req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        investments: {
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    // Calculate performance metrics for each property
    const performanceData = properties.map(property => {
      const totalInvestment = property.investments.reduce((acc, investment) => acc + parseFloat(investment.amount.toString()), 0);
      const numberOfInvestments = property.investments.length;

      // Return performance data for the property
      return {
        propertyId: property.id,
        propertyName: property.name,
        totalInvestment,
        numberOfInvestments,
        averageInvestment: numberOfInvestments ? totalInvestment / numberOfInvestments : 0,
        // You can add more metrics here based on your business logic
      };
    });

    res.status(200).json(performanceData);
  } catch (error) {
    console.error('Error fetching property performance:', error);
    res.status(500).json({ error: 'Error fetching property performance data' });
  }
};
