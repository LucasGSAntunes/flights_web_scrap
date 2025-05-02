import { FlightSearchParamsDTO } from '../../../domain/dtos/FlightSearchParamsDTO';

describe('FlightSearchParamsDTO.validate', () => {
    it('should validate single trip with all required fields', () => {
        const data = {
            url: 'https://www.example.com',
            from: 'NYC',
            to: 'LAX',
            departureDate: '2023-12-01',
            returnDate: undefined,
            adults: 1,
            children: 0,
            infants: 0,
            students: 0,
            isRoundTrip: false,
            isMultiCity: false,
            segments: [],
        };

        const result = FlightSearchParamsDTO.validate(data);

        expect(result).toEqual({
            url: 'https://www.example.com',
            from: 'NYC',
            to: 'LAX',
            departureDate: '2023-12-01',
            returnDate: undefined,
            adults: 1,
            children: 0,
            infants: 0,
            students: 0,
            isRoundTrip: false,
            isMultiCity: false,
            segments: [],
        });
    });

    it('should throw an error if a required field is missing for single trip', () => {
        const data = {
            from: 'NYC',
            to: 'LAX',
            departureDate: '2023-12-01',
        };

        expect(() => FlightSearchParamsDTO.validate(data)).toThrow('Missing required field: adults');
    });

    it('should throw an error if departureDate format is invalid', () => {
        const data = {
            from: 'NYC',
            to: 'LAX',
            departureDate: '12-01-2023',
            adults: 1,
        };

        expect(() => FlightSearchParamsDTO.validate(data)).toThrow('Invalid departureDate format. Use YYYY-MM-DD');
    });

    it('should throw an error if multi-city trip is not available', () => {
        const data = {
            isMultiCity: true,
            segments: [
                { from: 'NYC', to: 'LAX', date: '2023-12-01' },
                { from: 'LAX', to: 'SFO', date: '2023-12-05' },
            ],
        };

        expect(() => FlightSearchParamsDTO.validate(data)).toThrow('Multi-city searches are not supported yet.');
    });
});