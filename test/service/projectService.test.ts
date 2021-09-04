import { HttpClient } from '../../lib/internal/httpClient';
import { ProjectService } from '../../lib';

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

    it('remove and unRemove', async () => {
        const random = Math.random();
        const projectName = `project_${random}`;

        // origin
        const projectsOrigin = await sut.list();
        const countOrigin = projectsOrigin.length;

        // add a new project
        await sut.create(projectName);
        const projectsAfterAdded = await sut.list();
        const countAfterAdded = projectsAfterAdded.length;
        expect(countAfterAdded - countOrigin).toBe(1);

        // remove the added project
        await sut.remove(projectName);
        const projectsAfterRemoved = await sut.list();
        const countAfterRemoved = projectsAfterRemoved.length;
        expect(countAfterRemoved).toBe(countOrigin);

        // unRemove the removed project
        const projectUnRemoved = await sut.unRemove(projectName);
        expect(projectUnRemoved.name).toBe(projectName);
        expect(projectUnRemoved.createdAt).toBeTruthy();
        expect(projectUnRemoved.creator?.name).toBe('System');
        expect(projectUnRemoved.creator?.email).toBe(
            'system@localhost.localdomain',
        );

        // compare with the count of after added
        const projectsAfterUnRemoved = await sut.list();
        const countAfterUnRemoved = projectsAfterUnRemoved.length;
        expect(countAfterUnRemoved).toBe(countAfterAdded);
    });

    it('listRemoved', async () => {
        const random = Math.random();
        const projectName = `project_${random}`;

        // add a new project
        await sut.create(projectName);
        const projectsBeforeRemoved = await sut.listRemoved();
        expect(
            projectsBeforeRemoved
                .map((project) => project.name)
                .includes(projectName),
        ).toBe(false);

        // remove the added project
        await sut.remove(projectName);

        const projectsAfterRemoved = await sut.listRemoved();
        expect(
            projectsAfterRemoved
                .map((project) => project.name)
                .includes(projectName),
        ).toBe(true);
    });

    it('purge', async () => {
        const random = Math.random();
        const projectName = `project_${random}`;

        // origin
        const projectsOrigin = await sut.list();
        const countOrigin = projectsOrigin.length;

        // add a new project
        await sut.create(projectName);
        const projectsAfterAdded = await sut.list();
        const countAfterAdded = projectsAfterAdded.length;
        expect(countAfterAdded - countOrigin).toBe(1);

        // remove the added project
        await sut.remove(projectName);

        // purge the removed project
        await sut.purge(projectName);

        // compare with the origin
        const projectsAfterPurge = await sut.list();
        const countAfterPurge = projectsAfterPurge.length;
        expect(countAfterPurge).toBe(countOrigin);
    });
});
