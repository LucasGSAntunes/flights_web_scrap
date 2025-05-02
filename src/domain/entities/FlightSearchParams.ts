export interface FlightSearchParams {
    url: string;
    departureDate: string; 
    returnDate?: string; 
    from: string;
    to: string;
    adults: number;
    children?: number;
    infants?: number;
    students?: number;
    isRoundTrip?: boolean;
    isMultiCity?: boolean;
    segments?: FlightSegment[];
  }

  export interface FlightSegment {
    from: string;
    to: string;
    date: string;
  }
  
  export interface FlightData {
    flightCode: string;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    airline: string;
    price: string;
  }
  
  export interface IFlightScraper {
    scrap(params: FlightSearchParams): Promise<FlightData[]>;
  }
  