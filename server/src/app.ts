import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use('/api/v1/', authRoutes);

export default app;
