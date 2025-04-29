export interface ScrapedData {
    id: number,
    content: string[],
    metadata: {
      time: string,
      price: string, 
    }[],
    source: string;
    data: any; 
  }
  