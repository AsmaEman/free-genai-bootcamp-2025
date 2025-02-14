import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/error.middleware';
import config from './config';

// Import routes here
// import authRoutes from './routes/auth.routes';
// import wordRoutes from './routes/word.routes';
// import studyRoutes from './routes/study.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/words', wordRoutes);
// app.use('/api/study', studyRoutes);

// Error handling
app.use(errorHandler);

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Database connection initialized');
    
    // Start the server
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });
  })
  .catch((error) => {
    console.error('Error initializing database connection:', error);
    process.exit(1);
  });

export default app;
