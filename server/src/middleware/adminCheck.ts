
import { Request, Response, NextFunction } from 'express';

export const adminCheck = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
     res.status(403).json({ error: 'Admin access required' });
     return
    }
  next();
};
