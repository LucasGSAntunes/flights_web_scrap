// src/parsers/FlightTextParser.ts
import { ParsedFlight } from '../entities/ParsedFlight';

export class FlightTextParser {
  static parse(text: string): ParsedFlight {
    const lines = text.split('\n');

    const getIndex = (label: string) => lines.findIndex((l) => l.toLowerCase().includes(label));

    const departureTime = lines[0] || '';
    const from = lines[2] || '';
    const to = lines[6] || '';
    const arrivalTime = lines[4] || '';

    const aircraftMatch = text.match(/Aircraft type:(.*)/);
    const aircraft = aircraftMatch?.[1]?.trim() || '';

    const durationMatch = text.match(/Total travel duration\s*([\d]+h\s*\d+m)/i);
    const duration = durationMatch?.[1]?.trim() || '';


    const extractPrices = (input: string): { economy: string; business: string } => {
      const economyMatch = input.match(/ECONOMY[\s\S]*?BRL\s*([\d,.]+)\s*(\.\d+)/i);
      const businessMatch = input.match(/BUSINESS[\s\S]*?BRL\s*([\d,.]+)\s*(\.\d+)/i);

      return {
        economy: economyMatch ? economyMatch[1] : '',
        business: businessMatch ? businessMatch[1] : '',
      };
    };

    const prices = extractPrices(text);

    return {
      from,
      to,
      departureTime,
      arrivalTime,
      duration,
      aircraft,
      prices,
    };
  }
}
