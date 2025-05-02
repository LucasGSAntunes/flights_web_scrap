import { IScraper } from '../../../domain/contracts/IScraper';
import { FlightSearchParamsDTO } from '../../../domain/dtos/FlightSearchParamsDTO';
import { ScrapedData } from '../../../domain/entities/ScrapedData';

export class ScrapeUseCase {
  constructor(private scraper: IScraper) {}

  async execute(rawParams: any): Promise<ScrapedData> {
    const validatedParams = FlightSearchParamsDTO.validate(rawParams);
    return await this.scraper.scrap(validatedParams);
  }
}
