import { AppDataSource } from '../utils/database';
import { Movie } from '../models/Movie';

interface ProducerInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

interface ProducerStats {
  min: ProducerInterval[];
  max: ProducerInterval[];
}

export class ProducerService {
  async getProducerStats(): Promise<ProducerStats> {
    const movieRepository = AppDataSource.getRepository(Movie);
    
    // Get all winning movies
    const winners = await movieRepository.find({ 
      where: { winner: true },
      order: { year: 'ASC' }
    });

    // Process producers and their winning years
    const producerWins: Record<string, number[]> = {};

    winners.forEach(movie => {
      // Handle multiple producers (can be separated by ' and ' or ', ')
      const producers = movie.producers.split(/, | and /).map(p => p.trim());
      
      producers.forEach(producer => {
        if (!producerWins[producer]) {
          producerWins[producer] = [];
        }
        producerWins[producer].push(movie.year);
      });
    });

    // Calculate intervals for each producer
    const intervals: ProducerInterval[] = [];

    Object.keys(producerWins).forEach(producer => {
      const years = producerWins[producer].sort((a, b) => a - b);
      
      if (years.length >= 2) {
        for (let i = 1; i < years.length; i++) {
          intervals.push({
            producer,
            interval: years[i] - years[i - 1],
            previousWin: years[i - 1],
            followingWin: years[i]
          });
        }
      }
    });

    // Find min and max intervals
    if (intervals.length === 0) {
      return { min: [], max: [] };
    }

    const minInterval = Math.min(...intervals.map(i => i.interval));
    const maxInterval = Math.max(...intervals.map(i => i.interval));

    const minIntervals = intervals.filter(i => i.interval === minInterval);
    const maxIntervals = intervals.filter(i => i.interval === maxInterval);

    return {
      min: minIntervals,
      max: maxIntervals
    };
  }
}