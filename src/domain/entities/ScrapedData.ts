export interface ScrapedData {
  source: string,
  data: {
    id: string,
    testId: string,
    fullText: string,
  }[],
}