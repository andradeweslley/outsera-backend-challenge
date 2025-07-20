import { AppDataSource } from '../src/utils/database';
import { loadMoviesFromCSV } from '../src/utils/loadMoviesFromCSV';

beforeAll(async () => {
  await AppDataSource.initialize();
  await loadMoviesFromCSV('./data/Movielist.csv');
});

afterAll(async () => {
  await AppDataSource.destroy();
});