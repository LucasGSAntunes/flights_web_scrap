import { Request, Response } from 'express';
import { ScrapeController } from '../../../interfaces/controllers/ScrapeController';
import { ScrapeUseCase } from '../../../app/usecases/scrape/ScrapeUseCase';

describe('ScrapeController', () => {
    let scrapeUseCase: ScrapeUseCase;
    let scrapeController: ScrapeController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        scrapeUseCase = {
            execute: jest.fn(),
        } as unknown as ScrapeUseCase;

        scrapeController = new ScrapeController(scrapeUseCase);

        statusMock = jest.fn().mockReturnThis();
        jsonMock = jest.fn();

        mockRequest = {};
        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };
    });

    it('should return 400 if url is missing or invalid', async () => {
        mockRequest.body = {};

        await scrapeController.handle(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith({ error: 'Missing or invalid url' });
    });

    it('should call ScrapeUseCase and return result on success', async () => {
        const mockResult = { data: 'scraped data' };
        (scrapeUseCase.execute as jest.Mock).mockResolvedValue(mockResult);
        mockRequest.body = { url: 'http://example.com' };

        await scrapeController.handle(mockRequest as Request, mockResponse as Response);

        expect(scrapeUseCase.execute).toHaveBeenCalledWith(mockRequest.body);
        expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it('should return 500 if ScrapeUseCase throws an error', async () => {
        const mockError = new Error('Scraping error');
        (scrapeUseCase.execute as jest.Mock).mockRejectedValue(mockError);
        mockRequest.body = { url: 'http://example.com' };

        await scrapeController.handle(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            error: 'Scraping failed',
            details: mockError.message,
        });
    });

    it('should return 500 with unknown error if error is not an instance of Error', async () => {
        (scrapeUseCase.execute as jest.Mock).mockRejectedValue('Unknown error');
        mockRequest.body = { url: 'http://example.com' };

        await scrapeController.handle(mockRequest as Request, mockResponse as Response);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
            error: 'Scraping failed',
            details: 'Unknown error',
        });
    });
});