import { CentralDogmaClient } from '../lib/centralDogmaClient';
import { ContentService } from '../lib';

const client = new CentralDogmaClient({
    baseURL: 'http://localhost:36462',
});
const sut = new ContentService(client);

describe('ContentService', () => {
    it('listFiles', async () => {
        const [entries, statusCode] = await sut.listFiles('project1', 'repo1');
        expect(statusCode).toBe(200);
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].content).toEqual({
            field1: 'foo',
        });
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].content).toEqual({
            field1: 'bar',
        });
    });

    it('getFile', async () => {
        const [entry, statusCode] = await sut.getFile(
            'project1',
            'repo1',
            '/test1.json'
        );
        expect(statusCode).toBe(200);
        expect(entry.path).toBe('/test1.json');
        expect(entry.content).toEqual({
            field1: 'foo',
        });
    });
});
