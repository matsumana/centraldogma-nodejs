import { constants as http2constants } from 'http2';
import { HttpClient } from '../../lib/internal/httpClient';

const { HTTP2_HEADER_STATUS } = http2constants;

describe('HttpClient', () => {
    it('request to Central Dogma', async () => {
        const sut = new HttpClient({
            baseURL: 'http://localhost:36462',
        });

        const response = await sut.get('/');

        expect(response.headers[HTTP2_HEADER_STATUS]).toBe(200);
    });
});
