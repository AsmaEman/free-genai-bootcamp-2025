import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import config from './config';
import { swaggerSpec } from './config/swagger';
import authRoutes from './routes/auth.routes';
import wordRoutes from './routes/word.routes';
import studySessionRoutes from './routes/study-session.routes';
import { errorMiddleware } from './middleware/error.middleware';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/words', wordRoutes);
app.use('/api/study-sessions', studySessionRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Arabic Language Learning Platform API' });
});

// Error handling middleware
app.use(errorMiddleware);

// Initialize database connection first, then start server
const initializeApp = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database connection initialized');
    
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`API Documentation available at http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
};

initializeApp().catch(error => {
  console.error('Failed to initialize app:', error);
  process.exit(1);
});

export default app;
