import { Router } from 'express';
import { ScrapeController } from '../controllers/ScrapeController';
import { ScrapeUseCase } from '../../app/usecases/scrape/ScrapeUseCase';
import { TurkishAirlinesScraper } from '../../infra/scrapers/TurkishAirlinesScraper';

const router = Router();

const scraper = new TurkishAirlinesScraper();
const useCase = new ScrapeUseCase(scraper);
const controller = new ScrapeController(useCase);

router.get('/', async (req, res) => {
	try {
		await controller.handle(req, res);
	} catch (error) {
		res.status(500).send({ error: 'Internal Server Error' });
	}
});

export default router;
