import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';


export const auditLogMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const userId = req.user?.id; // Assuming the user is authenticated and their ID is in req.user
  const action = req.method; // Action type (GET, POST, DELETE, PATCH)
  const target = req.originalUrl.split('/')[2]; // Extracts the target (e.g., 'properties' or 'investments')
  const targetId = req.params.id ? parseInt(req.params.id) : 0; // Get target ID (if present)

  try {
    // Log the action in the database
    await prisma.auditLog.create({
      data: {
        action,
        userId: userId || 0, // In case of unauthenticated access, set userId to 0 (or handle as needed)
        target,
        targetId,
      },
    });
  } catch (error) {
    console.error('Error logging audit trail:', error);
  }

  next(); // Proceed with the request
};
