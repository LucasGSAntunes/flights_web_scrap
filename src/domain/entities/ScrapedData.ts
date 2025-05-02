import { FlightTextParser } from '../helpers/FlightTextParser';

export interface ScrapedData {
  source: string;
  data: {
    id: string;
    testId: string;
    fullText: string;
    parsed?: FlightTextParser;
  }[];
}
