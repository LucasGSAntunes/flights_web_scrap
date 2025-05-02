import { FlightSearchParams } from '../entities/FlightSearchParams';
import { ScrapedData } from '../entities/ScrapedData';

export interface IScraper {
  scrap(params: FlightSearchParams): Promise<ScrapedData>;
}