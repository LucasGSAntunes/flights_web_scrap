import { ScrapedData } from "../entities/ScrapedData";

export interface IScraper {
    scrap(url: string): Promise<ScrapedData>;
  }
  