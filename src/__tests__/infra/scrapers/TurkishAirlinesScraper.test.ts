
import { TurkishAirlinesScraper } from '../../../infra/scrapers/TurkishAirlinesScraper';
import { FlightSearchParams } from '../../../domain/entities/FlightSearchParams';
import { FlightTextParser } from '../../../domain/helpers/FlightTextParser';


describe('TurkishAirlinesScraper Integration', () => {
  jest.setTimeout(60000);

  const scraper = new TurkishAirlinesScraper();

  it('should return flight data for a valid one-way trip', async () => {
    const params: FlightSearchParams = {
      url: 'https://www.turkishairlines.com/',
      from: 'São Paulo',
      to: 'Dubai', 
      departureDate: '2025-05-20',
      returnDate: '',
      adults: 1,
      children: 0,
      infants: 0,
      students: 0,
      isRoundTrip: false,
      isMultiCity: false,
    };

    const result = await scraper.scrap(params);
    expect(result).toHaveProperty('source', 'Turkish Airlines');
    expect(Array.isArray(result.data)).toBe(true);
    expect(result.data.length).toBeGreaterThan(0);

    const first = result.data[0];
    expect(first).toHaveProperty('id');
    expect(first).toHaveProperty('testId');
    expect(first).toHaveProperty('fullText');
    expect(first).toHaveProperty('parsed');

    const parsed = FlightTextParser.parse(first.fullText);
    expect(parsed).toHaveProperty('from');
    expect(parsed).toHaveProperty('to');
    expect(parsed).toHaveProperty('departureTime');
    expect(parsed).toHaveProperty('arrivalTime');
    expect(parsed).toHaveProperty('duration');
    expect(parsed).toHaveProperty('aircraft');
    expect(parsed).toBeDefined();
    expect(parsed?.prices).toHaveProperty('economy');
    expect(parsed?.prices).toHaveProperty('business');
  });
});
