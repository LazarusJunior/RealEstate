import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import investmentRoutes from './routes/investmentRoutes';
import userRoutes from './routes/userRoutes';


dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/', authRoutes);
app.use('/api/v1', propertyRoutes);
app.use('/api/v1', investmentRoutes);
app.use('/api/v1', userRoutes);


export default app;
