import csv from 'csv-parser';
import fs from 'fs';
import { Movie } from '../models/Movie';
import { AppDataSource } from './database';

export async function loadMoviesFromCSV(filePath: string): Promise<void> {
  const movieRepository = AppDataSource.getRepository(Movie);
  const results: Movie[] = [];

  return new Promise((resolve, reject) => {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      reject(new Error(`CSV file not found: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        try {
          // Validate required fields
          if (!data.year || !data.title || !data.studios || !data.producers) {
            console.warn(`Skipping row with missing data: ${JSON.stringify(data)}`);
            return;
          }

          // Clean up the data
          const movie = new Movie();
          const year = parseInt(data.year, 10);

          if (isNaN(year)) {
            console.warn(`Skipping row with invalid year: ${data.year}`);
            return;
          }

          movie.year = year;
          movie.title = data.title.trim();
          movie.studios = data.studios.trim();
          movie.producers = data.producers.trim();
          movie.winner = data.winner ? data.winner.toLowerCase() === 'yes' : false;

          results.push(movie);
        } catch (error) {
          console.error('Error processing CSV row:', error);
        }
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            reject(new Error('No valid data found in CSV file'));
            return;
          }

          await movieRepository.save(results);
          console.log(`Successfully loaded ${results.length} movies from CSV`);
          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}