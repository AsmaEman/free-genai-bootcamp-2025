import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import { errorMiddleware } from './middleware/error.middleware';
import config from './config';
import { BaseEntity } from 'typeorm';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { AppError } from './utils/appError';
import helmet from 'helmet';
import { authRouter } from './routes/auth.routes';
import { wordRouter } from './routes/word.routes';
import { studySessionRouter } from './routes/study-session.routes';

// Import routes here
// import authRoutes from './routes/auth.routes';
// import wordRoutes from './routes/word.routes';
// import studyRoutes from './routes/study.routes';

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/words', wordRouter);
app.use('/api/study-sessions', studySessionRouter);
// app.use('/api/study', studyRoutes);

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Language Learning API',
      version: '1.0.0',
      description: 'API documentation for Language Learning Platform',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/controllers/*.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Error handling middleware
app.use(errorMiddleware);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
    BaseEntity.useDataSource(AppDataSource);
    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });

export { app };
