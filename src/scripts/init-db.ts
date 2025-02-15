import 'reflect-metadata';
import 'dotenv/config';
import { AppDataSource } from '../config/database';

async function initializeDatabase() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    console.log('Database connected successfully');

    console.log('Synchronizing database schema...');
    await AppDataSource.synchronize(false); // false means don't drop existing tables
    console.log('Database schema synchronized successfully');

    await AppDataSource.destroy();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

initializeDatabase();
