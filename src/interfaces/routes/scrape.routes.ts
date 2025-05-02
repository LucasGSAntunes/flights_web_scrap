import { Router } from 'express';
import { ScrapeController } from '../controllers/ScrapeController';
import { ScrapeUseCase } from '../../app/usecases/scrape/ScrapeUseCase';
import { TurkishAirlinesScraper } from '../../infra/scrapers/TurkishAirlinesScraper';

const router = Router();

const scraper = new TurkishAirlinesScraper();
const useCase = new ScrapeUseCase(scraper);
const controller = new ScrapeController(useCase);

router.post('/', async (req, res) => {
	await controller.handle(req, res);
});

export default router;
