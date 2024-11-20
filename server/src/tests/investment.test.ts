import request from 'supertest';
import app from '../app'; // Express app
import prisma from '../config/database';

jest.mock('../config/database');

describe('InvestmentController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /investments', () => {
        it('should create a new investment', async () => {
            (prisma.property.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
            (prisma.investment.create as jest.Mock).mockResolvedValue({
                id: 1,
                amount: 1000,
                propertyId: 1,
                userId: 1,
            });

            const res = await request(app)
                .post('/investments')
                .set('Authorization', 'Bearer validToken')
                .send({ propertyId: 1, amount: 1000 });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Investment created successfully');
        });

        it('should return 404 if property does not exist', async () => {
            (prisma.property.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await request(app)
                .post('/investments')
                .send({ propertyId: 1, amount: 1000 });

            expect(res.status).toBe(404);
            expect(res.body.error).toBe('Property not found');
        });
    });

    describe('GET /investments', () => {
        it('should fetch all investments for admin', async () => {
            (prisma.investment.findMany as jest.Mock).mockResolvedValue([
                {
                    id: 1,
                    amount: 1000,
                    property: { id: 1, name: 'Property 1' },
                    user: { id: 1, name: 'John Doe' },
                },
            ]);

            const res = await request(app).get('/investments').set('Authorization', 'Bearer adminToken');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
        });
    });
});
