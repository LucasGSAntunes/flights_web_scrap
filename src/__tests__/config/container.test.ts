import { container } from '../../config/container';
import { ScrapeController } from '../../interfaces/controllers/ScrapeController';

describe('container', () => {
    it('should have a scrapeController instance', () => {
        expect(container.scrapeController).toBeInstanceOf(ScrapeController);
    });

    it('scrapeController should have a valid use case', () => {
        const scrapeController = container.scrapeController;
        expect(scrapeController).toHaveProperty('scrapeUseCase');
        expect(scrapeController.scrapeUseCase).toBeDefined();
    });
});