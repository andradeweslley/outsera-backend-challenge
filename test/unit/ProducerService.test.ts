import { ProducerService } from '../../src/services/ProducerService';
import { AppDataSource } from '../../src/utils/database';
import { Movie } from '../../src/models/Movie';

describe('ProducerService', () => {
  let producerService: ProducerService;
  let movieRepository: any;

  beforeAll(async () => {
    // Database is already initialized by test/setup.ts
    producerService = new ProducerService();
    movieRepository = AppDataSource.getRepository(Movie);
  });

  beforeEach(async () => {
    await movieRepository.clear();
  });

  describe('getProducerStats', () => {
    it('should return empty arrays when no winning movies exist', async () => {
      const stats = await producerService.getProducerStats();

      expect(stats.min).toEqual([]);
      expect(stats.max).toEqual([]);
    });

    it('should calculate intervals correctly for single producer', async () => {
      // Create test data: one producer with wins in 2000 and 2005
      const movies = [
        { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer A', winner: true },
        { year: 2005, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer A', winner: true }
      ];

      await movieRepository.save(movies);

      const stats = await producerService.getProducerStats();

      expect(stats.min).toHaveLength(1);
      expect(stats.max).toHaveLength(1);
      expect(stats.min[0].producer).toBe('Producer A');
      expect(stats.min[0].interval).toBe(5);
      expect(stats.min[0].previousWin).toBe(2000);
      expect(stats.min[0].followingWin).toBe(2005);
    });

    it('should handle multiple producers with same interval', async () => {
      // Create test data with two producers having the same interval
      const movies = [
        { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer A', winner: true },
        { year: 2002, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer A', winner: true },
        { year: 2005, title: 'Movie 3', studios: 'Studio 3', producers: 'Producer B', winner: true },
        { year: 2007, title: 'Movie 4', studios: 'Studio 4', producers: 'Producer B', winner: true }
      ];

      await movieRepository.save(movies);

      const stats = await producerService.getProducerStats();

      expect(stats.min).toHaveLength(2);
      expect(stats.max).toHaveLength(2);
      expect(stats.min[0].interval).toBe(2);
      expect(stats.min[1].interval).toBe(2);
    });

    it('should handle producers with "and" separator', async () => {
      const movies = [
        { year: 2000, title: 'Movie 1', studios: 'Studio 1', producers: 'Producer A and Producer B', winner: true },
        { year: 2005, title: 'Movie 2', studios: 'Studio 2', producers: 'Producer A', winner: true }
      ];

      await movieRepository.save(movies);

      const stats = await producerService.getProducerStats();

      // Should find Producer A with interval 5
      expect(stats.min).toHaveLength(1);
      expect(stats.min[0].producer).toBe('Producer A');
      expect(stats.min[0].interval).toBe(5);
    });
  });
}); 