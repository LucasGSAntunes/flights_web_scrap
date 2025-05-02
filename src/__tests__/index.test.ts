import { startServer } from '../server';

jest.mock('../server', () => ({
    startServer: jest.fn(),
}));

describe('index.ts', () => {
    it('should call startServer', () => {
        require('../index');
        expect(startServer).toHaveBeenCalled();
    });
});