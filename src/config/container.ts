import { TurkishAirlinesScraper } from '../infra/scrapers/TurkishAirlinesScraper';
import { ScrapeUseCase } from '../app/usecases/scrape/ScrapeUseCase';
import { ScrapeController } from '../interfaces/controllers/ScrapeController';

const scraper = new TurkishAirlinesScraper();
const scrapeUseCase = new ScrapeUseCase(scraper);
const scrapeController = new ScrapeController(scrapeUseCase);

export const container = {
  scrapeController
};
