import request from 'supertest';
import app from '../app'; // Express app
import prisma from '../config/database';
import { hashPassword } from '../utils/authUtils';

// Mock Prisma and utilities
jest.mock('../config/database');
jest.mock('../utils/authUtils');

describe('AuthController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /register', () => {
        it('should register a new user', async () => {
            // Mock the database calls
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // No existing user
            (hashPassword as jest.Mock).mockResolvedValue('hashedPassword');
            (prisma.user.create as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'John Doe',
                email: 'johndoe@example.com',
                role: 'USER',
            });

            const res = await request(app).post('/auth/register').send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Registration successful');
        });

        it('should return 400 if user already exists', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

            const res = await request(app).post('/auth/register').send({
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(400);
            expect(res.body.error).toBe('User already exists');
        });
    });

    describe('POST /login', () => {
        it('should login an existing user', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue({
                id: 1,
                email: 'johndoe@example.com',
                passwordHash: 'hashedPassword',
                role: 'USER',
            });
            (hashPassword as jest.Mock).mockResolvedValue(true);

            const res = await request(app).post('/auth/login').send({
                email: 'johndoe@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(200);
            expect(res.body.user).toHaveProperty('id');
            expect(res.body.user.email).toBe('johndoe@example.com');
        });

        it('should return 401 for invalid credentials', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await request(app).post('/auth/login').send({
                email: 'wrong@example.com',
                password: 'password123',
            });

            expect(res.status).toBe(401);
            expect(res.body.error).toBe('Invalid email or password');
        });
    });
});
