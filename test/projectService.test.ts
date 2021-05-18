import { HttpClient } from '../lib/internal/httpClient';
import { ProjectService } from '../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new ProjectService(client);

describe('ProjectService', () => {
    it('create', async () => {
        const random = Math.random();
        const projectName = `project_${random}`;
        const project = await sut.create(projectName);
        expect(project.name).toBe(projectName);
        expect(project.createdAt).toBeTruthy();
        expect(project.creator?.name).toBe('System');
        expect(project.creator?.email).toBe('system@localhost.localdomain');
    });
    it('list', async () => {
        const projects = await sut.list();
        expect(projects.length).toBeGreaterThanOrEqual(2); // initial test data has two projects
        expect(projects[0].name).toBe('project1');
        expect(projects[0].url).toBe('/api/v1/projects/project1');
        expect(projects[1].name).toBe('project2');
        expect(projects[1].url).toBe('/api/v1/projects/project2');
    });
});
