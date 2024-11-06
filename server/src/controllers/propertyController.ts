import e, { Request, Response } from 'express';
import prisma from '../config/database';
import { activeUser } from '../utils/authUtils'; 

export const createProperty = async (req: Request, res: Response) => {
    try {
        //Retrieve active user
        const user = await activeUser(req, res);
        
        //Check if user is admin
        if (!user || user.role !== 'ADMIN') {
             res.status(403).json({ error: 'Admin access required' });
             return
            }

        //Extract property details from request body
        const { name, description, location, targetInvestment } = req.body;

        // Check if property already exists
        const existingProperty = await prisma.property.findUnique({
            where: { name },
        });

        if (existingProperty) {
            res.status(409).json({ error: 'Property already exists' });
            return;
        }
        //Create the property
        const property = await prisma.property.create({
            data: { name, description, location, targetInvestment },
        });

        res.status(201).json({ message: 'Property created successfully', property });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ error: 'Error creating property' });
    }
};
 
export const getProperties = async (req: Request, res: Response) => {
    try {
        const properties = await prisma.property.findMany();
        res.status(200).json({ properties });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Error fetching properties' });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        res.status(200).json({ property });
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).json({ error: 'Error fetching property' });
    }
}

export const updateProperty = async (req: Request, res: Response) => {
    try {
        //Retrieve active user
        const user = await activeUser(req, res);
        
        //Check if user is admin
        if (!user || user.role !== 'ADMIN') {
             res.status(403).json({ error: 'Admin access required' });
             return
            }

        const id = Number(req.params.id);
        const { name, description, location, targetInvestment } = req.body;

        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: { name, description, location, targetInvestment },
        });

        res.status(200).json({ message: 'Property updated successfully', property: updatedProperty });
    } catch (error) {
        console.error('Error updating property:', error);
        res.status(500).json({ error: 'Error updating property' });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    try {
        //Retrieve active user
        const user = await activeUser(req, res);
        
        //Check if user is admin
        if (!user || user.role !== 'ADMIN') {
             res.status(403).json({ error: 'Admin access required' });
             return
            }

        const id = Number(req.params.id);
        const property = await prisma.property.findUnique({
            where: { id },
        });

        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }

        await prisma.property.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ error: 'Error deleting property' });
    }
}


export const getPropertyDetails = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      // Fetch the property with related investments
      const property = await prisma.property.findUnique({
        where: { id: Number(id) },
        include: {
          investments: true, // Include investments associated with the property
        },
      });
  
      if (!property) {
         res.status(404).json({ error: 'Property not found' });
         return
        }
  
      // Calculate total investments for the property
      const totalInvestments = property.investments.reduce((acc, investment) => acc + Number(investment.amount), 0);
  
      // Calculate Return on Investment for the property
      const roi = ((totalInvestments / Number(property.targetInvestment)) * 100).toFixed(2);
  
      res.status(200).json({
        property: {
          id: property.id,
          name: property.name,
          description: property.description,
          location: property.location,
          targetInvestment: property.targetInvestment,
          createdAt: property.createdAt,
          totalInvestments, // Total investments in this property
          roi, // Calculated ROI
          investments: property.investments, // Investment history for this property
        },
      });
    } catch (error) {
      console.error('Error fetching property details:', error);
      res.status(500).json({ error: 'Error fetching property details' });
    }
  };
  