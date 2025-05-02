import { Request, Response } from 'express';
import { ScrapeUseCase } from '../../app/usecases/scrape/ScrapeUseCase';

export class ScrapeController {
  constructor(public scrapeUseCase: ScrapeUseCase) {}

  async handle(req: Request, res: Response) {
    const body = req.body;
    if (!body || typeof body.url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid url' });
    }

    try {
      const result = await this.scrapeUseCase.execute(req.body);
      res.json(result);
    } catch (err) {
      res.status(500).json({ 
        error: 'Scraping failed', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }
}
