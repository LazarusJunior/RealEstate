
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const authenticateJWT = (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies.token; 

    if (!token) {
         res.status(401).json({ error: 'Unauthorized' });
         return
        }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; role: string };
        req.user = { id: decoded.userId, role: decoded.role };
        next();
    } catch {
         res.status(403).json({ error: 'Invalid token' });
         return
        }
};
