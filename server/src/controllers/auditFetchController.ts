import { Request, Response } from 'express';
import prisma from '../config/database';


export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc', // Sort by most recent first
      },
      include: {
        user: { select: { name: true, email: true } }, // Include user info for the logs
      },
    });
    res.status(200).json(auditLogs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Error fetching audit logs' });
  }
};
