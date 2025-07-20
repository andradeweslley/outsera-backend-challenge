import express from 'express';
import cors from 'cors';
import { ProducerController } from './controllers/ProducerController';
import { AppDataSource } from './utils/database';
import { loadMoviesFromCSV } from './utils/loadMoviesFromCSV';

export async function createApp() {
  const app = express();

  // Initialize database if not already initialized
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
    // Load CSV data only if we just initialized the database
    await loadMoviesFromCSV('./data/Movielist.csv');
  }

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  const producerController = new ProducerController();
  app.get('/api/producers/stats', producerController.getProducerStats.bind(producerController));

  // Health check
  app.get('/health', (req, res) => res.status(200).send('OK'));

  return app;
}