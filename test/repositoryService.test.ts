import { HttpClient } from '../lib/internal/httpClient';
import { ProjectService, RepositoryService } from '../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const projectService = new ProjectService(client);
const sut = new RepositoryService(client);

describe('RepositoryService', () => {
    it('create', async () => {
        const random = Math.random();
        const projectName = `project_${random}`;
        await projectService.create(projectName);

        const repoName = `repo_${random}`;
        const repo = await sut.create(projectName, repoName);
        expect(repo.name).toBe(repoName);
        expect(repo.createdAt).toBeTruthy();
        expect(repo.creator?.name).toBe('admin');
        expect(repo.creator?.email).toBe('admin@localhost.localdomain');
    });

    it('list', async () => {
        const repositories = await sut.list('project1');
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
