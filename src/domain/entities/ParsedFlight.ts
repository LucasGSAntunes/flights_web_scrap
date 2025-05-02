export interface ParsedFlight {
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    aircraft: string;
    prices: {
      economy: string;
      business: string;
    };
  }
  