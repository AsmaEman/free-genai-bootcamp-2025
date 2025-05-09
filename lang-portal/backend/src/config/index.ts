import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

interface Config {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  redisUrl: string;
  database: PostgresConnectionOptions;
}

const config: Config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  database: {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    name: 'default',
    database: process.env.DB_NAME || 'lang_portal',
    entities: ['src/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
};

export default config;
