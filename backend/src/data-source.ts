import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'raavi_db',
  entities:   [path.join(__dirname, '**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, 'database/migrations/*.{ts,js}')],
  synchronize: false,
  logging: true,
});
