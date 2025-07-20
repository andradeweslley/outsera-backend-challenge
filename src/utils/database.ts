import { DataSource } from 'typeorm';
import { Movie } from '../models/Movie';

const isTest = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: isTest ? ':memory:' : './database.sqlite',
  entities: [Movie],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  dropSchema: isTest // Clean database for tests
});