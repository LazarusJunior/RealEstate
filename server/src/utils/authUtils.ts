import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import prisma from '../config/database'; 

dotenv.config();

// Utility function to hash passwords
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

// function to compare passwords
export const comparePasswords = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
};

// generate JWT
export const generateToken = (userId: number, role: string): string => {
    return jwt.sign({ userId, role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

// Utility function to retrieve active user from token in cookies
export const activeUser = async (
    req: Request,
    res: Response
): Promise<{ userId: number; name: string; email: string; role: string } | null> => {
    //Check for token in cookies
    const token = req.cookies.token;
    if (!token) {
        console.log("No token found in cookies");
        return null;
    }

    try {
        // Verify the token and get userId and role
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; role: string };
        
        //Retrieve the user details from the database using userId
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, name: true, email: true, role: true } 
        });

        if (!user) {
            console.log("User not found");
            return null;
        }

        return { userId: user.id, name: user.name, email: user.email, role: user.role };
    } catch (error) {
        console.log("Invalid token:", error);
        return null;
    }
};
