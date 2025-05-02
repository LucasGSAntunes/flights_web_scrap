import { FlightSearchParams } from '../entities/FlightSearchParams';

export class FlightSearchParamsDTO {
  static validate(data: any): FlightSearchParams {
    if (data.isMultiCity) {
      throw new Error('Multi-city searches are not supported yet.');
    } else {
      const requiredFields = ['from', 'to', 'departureDate', 'adults'];
      for (const field of requiredFields) {
        if (!data[field]) throw new Error(`Missing required field: ${field}`);
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.departureDate)) {
        throw new Error('Invalid departureDate format. Use YYYY-MM-DD');
      }
      if (data.returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(data.returnDate)) {
        throw new Error('Invalid returnDate format. Use YYYY-MM-DD');
      }
    }

    return {
      url: data.url || 'https://www.example.com',
      from: data.from,
      to: data.to,
      departureDate: data.departureDate,
      returnDate: data.returnDate,
      adults: Number(data.adults),
      children: Number(data.children),
      infants: Number(data.infants),
      students: Number(data.students),
      isRoundTrip: Boolean(data.isRoundTrip),
      isMultiCity: Boolean(data.isMultiCity),
      segments: data.segments || [],
    };
  }
}
