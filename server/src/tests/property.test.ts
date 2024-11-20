import request from 'supertest';
import app from '../app'; // Express app
import prisma from '../config/database';

jest.mock('../config/database');

describe('PropertyController Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /properties', () => {
        it('should create a new property as admin', async () => {
            (prisma.property.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.property.create as jest.Mock).mockResolvedValue({
                id: 1,
                name: 'New Property',
            });

            const res = await request(app)
                .post('/properties')
                .set('Authorization', 'Bearer adminToken')
                .send({
                    name: 'New Property',
                    description: 'A description',
                    location: 'Somewhere',
                    targetInvestment: 10000,
                });

            expect(res.status).toBe(201);
            expect(res.body.property.name).toBe('New Property');
        });

        it('should return 409 if property already exists', async () => {
            (prisma.property.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

            const res = await request(app)
                .post('/properties')
                .set('Authorization', 'Bearer adminToken')
                .send({ name: 'Existing Property' });

            expect(res.status).toBe(409);
            expect(res.body.error).toBe('Property already exists');
        });
    });

    describe('GET /properties', () => {
        it('should fetch all properties', async () => {
            (prisma.property.findMany as jest.Mock).mockResolvedValue([
                { id: 1, name: 'Property 1' },
                { id: 2, name: 'Property 2' },
            ]);

            const res = await request(app).get('/properties');

            expect(res.status).toBe(200);
            expect(res.body.properties).toHaveLength(2);
        });
    });
});
