import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import cityRoutes from './routes/cityRoutes';
import namedListRoutes from './routes/namedListRoutes';
import healthcheckRoutes from './routes/healthcheck';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/cities', cityRoutes);
app.use('/api/named-lists', namedListRoutes);
app.use('/healthcheck', healthcheckRoutes);

app.get('/', (req, res) => {
  res.send('City Service API is running');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
