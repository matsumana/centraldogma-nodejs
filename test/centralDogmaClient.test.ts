import http2 from 'http2';
import { HttpClient } from '../lib/internal/httpClient';

const { HTTP2_HEADER_STATUS } = http2.constants;

describe('CentralDogmaClient', () => {
    it('request to Central Dogma', async () => {
        const sut = new HttpClient({
            baseURL: 'http://localhost:36462',
        });

        const response = await sut.request('/');

        expect(response.headers[HTTP2_HEADER_STATUS]).toBe(200);
    });
});
