import { Request, Response } from 'express';
import { ScrapeUseCase } from '../../app/usecases/scrape/ScrapeUseCase';

export class ScrapeController {
  constructor(private scrapeUseCase: ScrapeUseCase) {}

  async handle(req: Request, res: Response) {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid url' });
    }

    try {
      const result = await this.scrapeUseCase.execute(url);
      res.json(result);
    } catch (err) {
      res.status(500).json({ 
        error: 'Scraping failed', 
        details: err instanceof Error ? err.message : 'Unknown error' 
      });
    }
  }
}
