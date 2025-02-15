import 'reflect-metadata';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import config from './config';
import { swaggerSpec } from './config/swagger';
import { authRouter } from './routes/auth.routes';
import { wordRouter } from './routes/word.routes';
import { studySessionRouter } from './routes/study-session.routes';
import { errorMiddleware } from './middleware/error.middleware';
import morgan from 'morgan';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/words', wordRouter);
app.use('/api/study-sessions', studySessionRouter);

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

export { app };
