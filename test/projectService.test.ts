import { HttpClient } from '../lib/internal/httpClient';
import { ProjectService } from '../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new ProjectService(client);

describe('ProjectService', () => {
    it('list', async () => {
        const projects = await sut.list();
        expect(projects.length).toBe(2);
        expect(projects[0].name).toBe('project1');
        expect(projects[0].url).toBe('/api/v1/projects/project1');
        expect(projects[1].name).toBe('project2');
        expect(projects[1].url).toBe('/api/v1/projects/project2');
    });
});
