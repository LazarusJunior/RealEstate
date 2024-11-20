import { PrismaClient } from '@prisma/client';
import supertest from 'supertest';
import app from '../app'; 

const prisma = new PrismaClient();
const request = supertest(app);

export const testUtils = {
  prisma,
  request,
  resetDatabase: async () => {
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE users, properties, investments RESTART IDENTITY CASCADE;
    `);
  },
};

export default testUtils;
