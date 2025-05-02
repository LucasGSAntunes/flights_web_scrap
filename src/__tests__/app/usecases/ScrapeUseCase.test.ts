import { ScrapeUseCase } from '../../../app/usecases/scrape/ScrapeUseCase';
import { IScraper } from '../../../domain/contracts/IScraper';
import { FlightSearchParamsDTO } from '../../../domain/dtos/FlightSearchParamsDTO';
import { ScrapedData } from '../../../domain/entities/ScrapedData';
import { ParsedFlight } from '../../../domain/entities/ParsedFlight';
import { raw } from 'express';

describe('ScrapeUseCase', () => {
  let mockScraper: jest.Mocked<IScraper>;
  let scrapeUseCase: ScrapeUseCase;

  beforeEach(() => {
    mockScraper = { scrap: jest.fn() };
    scrapeUseCase = new ScrapeUseCase(mockScraper);
  });

  it('should validate input and call scraper with validated params', async () => {
    const rawParams = { 
        url: 'https://www.example.com',
        from: 'NYC',
        to: 'LAX',
        departureDate: '2023-12-01',
        returnDate: undefined,
        adults: 1,
        children: 0,
        infants: 0,
        students: 0,
        isRoundTrip: false,
        isMultiCity: false,
        segments: [],
    };
    const validatedParams = FlightSearchParamsDTO.validate(rawParams);
    const dummyParsed: ParsedFlight = {
      from: rawParams.from,
      to: rawParams.to,
      departureTime: rawParams.departureDate,
      arrivalTime: rawParams.departureDate,
      duration: '2h',
      aircraft: 'Boeing 737',
      prices: {
        economy: "100",
        business: "200",
    },

    };
    const scrapedData: ScrapedData = {
      source: 'unit-test',
      data: [{ id: '1', testId: 't1', fullText: 'Sample', parsed: dummyParsed }]
    };

    jest.spyOn(FlightSearchParamsDTO, 'validate').mockReturnValue(validatedParams);

    const result = await scrapeUseCase.execute(rawParams);

    expect(FlightSearchParamsDTO.validate).toHaveBeenCalledWith(rawParams);
    expect(mockScraper.scrap).toHaveBeenCalledWith(validatedParams);
  });

  it('should throw if validation fails', async () => {
    const rawParams = { invalid: true };
    const validationError = new Error('Validation failed');
    jest.spyOn(FlightSearchParamsDTO, 'validate').mockImplementation(() => { throw validationError; });

    expect(mockScraper.scrap).not.toHaveBeenCalled();
    await expect(scrapeUseCase.execute(rawParams)).rejects.toThrow(validationError);
  });
});
