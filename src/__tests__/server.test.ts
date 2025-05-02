import { startServer } from '../../src/server';
import app from '../app';

jest.mock('../../src/app', () => ({
    listen: jest.fn((port, callback) => callback()),
}));

describe('startServer', () => {
    const originalConsoleLog = console.log;
    let consoleLogMock: jest.Mock;

    beforeEach(() => {
        consoleLogMock = jest.fn();
        console.log = consoleLogMock;
    });

    afterEach(() => {
        console.log = originalConsoleLog;
        jest.clearAllMocks();
    });

    it('should start the server on the default port if no PORT environment variable is set', () => {
        delete process.env.PORT;

        startServer();

        expect(app.listen).toHaveBeenCalledWith(3000, expect.any(Function));
        expect(consoleLogMock).toHaveBeenCalledWith('🚀 Server running on http://localhost:3000');
    });

    it('should start the server on the port specified in the PORT environment variable', () => {
        process.env.PORT = '4000';

        startServer();

        expect(app.listen).toHaveBeenCalledWith("4000", expect.any(Function));
        expect(consoleLogMock).toHaveBeenCalledWith('🚀 Server running on http://localhost:4000');
    });
});