import { HttpClient } from '../lib/internal/httpClient';
import { RepositoryService } from '../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new RepositoryService(client);

describe('RepositoryService', () => {
    it('list', async () => {
        const [repositories, statusCode] = await sut.list('project1');
        expect(statusCode).toBe(200);
        expect(repositories.length).toBe(4);

        expect(repositories[0].name).toBe('dogma');
        expect(repositories[0].url).toBe(
            '/api/v1/projects/project1/repos/dogma'
        );
        expect(repositories[1].name).toBe('meta');
        expect(repositories[1].url).toBe(
            '/api/v1/projects/project1/repos/meta'
        );

        expect(repositories[2].name).toBe('repo1');
        expect(repositories[2].url).toBe(
            '/api/v1/projects/project1/repos/repo1'
        );
        expect(repositories[3].name).toBe('repo2');
        expect(repositories[3].url).toBe(
            '/api/v1/projects/project1/repos/repo2'
        );
    });
});
