import { IScraper } from '../../domain/contracts/IScraper';
import { TurkishAirlinesScraper } from '../../infra/scrapers/TurkishAirlinesScraper';

export class ScraperFactory {
  static getScraperByCarrierCode(code: string): IScraper {
    if (code === 'TK') return new TurkishAirlinesScraper();
    throw new Error('Unsupported airline');
  }
}
