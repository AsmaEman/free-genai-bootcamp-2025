import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../models/User';
import { Word } from '../models/Word';
import { WordProgress } from '../models/WordProgress';
import { StudySession } from '../models/StudySession';
import config from './index';

const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true, // Set to false in production
  logging: config.nodeEnv === 'development',
  entities: [User, Word, WordProgress, StudySession],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(dbConfig);
