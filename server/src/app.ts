import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import investmentRoutes from './routes/investmentRoutes';
import userRoutes from './routes/userRoutes';
import cors from 'cors';


dotenv.config();

const app = express();
// CORS middleware with specific origin and credentials
const corsOptions = {
    origin: 'http://localhost:5173', //frontend URL
    credentials: true,
  };
  app.use(cors(corsOptions));
  

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/', authRoutes);
app.use('/api/v1', propertyRoutes);
app.use('/api/v1', investmentRoutes);
app.use('/api/v1', userRoutes);


export default app;
