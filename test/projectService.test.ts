import { CentralDogmaClient, ProjectService } from '../lib';

describe('ProjectService', () => {
    it('list', async () => {
        const client = new CentralDogmaClient({
            baseURL: 'http://localhost:36462',
        });
        const sut = new ProjectService(client);

        const [projects, statusCode] = await sut.list();
        expect(statusCode).toBe(200);
        expect(projects.length).toBe(2);
        expect(projects[0].name).toBe('project1');
        expect(projects[0].url).toBe('/api/v1/projects/project1');
        expect(projects[1].name).toBe('project2');
        expect(projects[1].url).toBe('/api/v1/projects/project2');
    });
});
