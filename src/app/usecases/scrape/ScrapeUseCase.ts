import { IScraper } from '../../../domain/contracts/IScraper';
import { ScrapedData } from '../../../domain/entities/ScrapedData';

export class ScrapeUseCase {
  constructor(private scraper: IScraper) {}

  async execute(url: string): Promise<ScrapedData> {
    return await this.scraper.scrap(url);
  }
}
