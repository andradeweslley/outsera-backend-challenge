import { Request, Response } from 'express';
import { ProducerService } from '../services/ProducerService';

export class ProducerController {
  private producerService: ProducerService;

  constructor() {
    this.producerService = new ProducerService();
  }

  async getProducerStats(req: Request, res: Response) {
    try {
      const stats = await this.producerService.getProducerStats();

      res.json(stats);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to retrieve producer statistics'
      });
    }
  }
}