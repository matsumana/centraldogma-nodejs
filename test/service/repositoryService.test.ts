import { HttpClient } from '../../lib/internal/httpClient';
import { RepositoryService } from '../../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new RepositoryService(client);

describe('RepositoryService', () => {
    it('create', async () => {
        const random = Math.random();
        const projectName = 'project3';
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

    it('remove and unRemove', async () => {
        // origin
        const projectName = 'project3';
        const reposOrigin = await sut.list(projectName);
        const countOrigin = reposOrigin.length;

        // add a new repo
        const random = Math.random();
        const repoName = `repo_${random}`;
        await sut.create(projectName, repoName);
        const reposAfterAdded = await sut.list(projectName);
        const countAfterAdded = reposAfterAdded.length;
        expect(countAfterAdded - countOrigin).toBe(1);

        // remove the added project
        await sut.remove(projectName, repoName);
        const reposAfterRemoved = await sut.list(projectName);
        const countAfterRemoved = reposAfterRemoved.length;
        expect(countAfterRemoved).toBe(countOrigin);

        // unRemove the removed project
        const repoUnRemoved = await sut.unRemove(projectName, repoName);
        expect(repoUnRemoved.name).toBe(repoName);
        expect(repoUnRemoved.createdAt).toBeTruthy();
        expect(repoUnRemoved.creator?.name).toBe('admin');
        expect(repoUnRemoved.creator?.email).toBe(
            'admin@localhost.localdomain'
        );

        // compare with the count of after added
        const reposAfterUnRemoved = await sut.list(projectName);
        const countAfterUnRemoved = reposAfterUnRemoved.length;
        expect(countAfterUnRemoved).toBe(countAfterAdded);
    });

    it('listRemoved', async () => {
        // add a new repo
        const projectName = 'project3';
        const random = Math.random();
        const repoName = `repo_${random}`;
        await sut.create(projectName, repoName);
        const reposBeforeRemoved = await sut.listRemoved(projectName);
        expect(
            reposBeforeRemoved.map((repo) => repo.name).includes(repoName)
        ).toBe(false);

        // remove the added repo
        await sut.remove(projectName, repoName);

        const reposAfterRemoved = await sut.listRemoved(projectName);
        expect(
            reposAfterRemoved.map((repo) => repo.name).includes(repoName)
        ).toBe(true);
    });

    it('purge', async () => {
        const projectName = 'project3';
        const random = Math.random();
        const repoName = `repo_${random}`;

        // origin
        const reposOrigin = await sut.list(projectName);
        const countOrigin = reposOrigin.length;

        // add a new repo
        await sut.create(projectName, repoName);
        const reposAfterAdded = await sut.list(projectName);
        const countAfterAdded = reposAfterAdded.length;
        expect(countAfterAdded - countOrigin).toBe(1);

        // remove the added repo
        await sut.remove(projectName, repoName);

        // purge the removed repo
        await sut.purge(projectName, repoName);

        // compare with the origin
        const reposAfterPurge = await sut.list(projectName);
        const countAfterPurge = reposAfterPurge.length;
        expect(countAfterPurge).toBe(countOrigin);
    });
});
