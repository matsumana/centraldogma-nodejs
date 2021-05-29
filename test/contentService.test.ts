import { HttpClient } from '../lib/internal/httpClient';
import { ContentService } from '../lib';
import { QueryTypes } from '../lib/contentService';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new ContentService(client);

describe('ContentService#listFiles without nested directory', () => {
    it('listFiles without pathPattern', async () => {
        const entries = await sut.listFiles('project1', 'repo1');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('listFiles with wildcard', async () => {
        const entries = await sut.listFiles('project1', 'repo1', '/test*.json');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('listFiles with specific path', async () => {
        const entries = await sut.listFiles('project1', 'repo1', '/test1.json');
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
    });

    it('listFiles with file path without dir', async () => {
        const entries = await sut.listFiles('project1', 'repo1', 'test*.json');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('listFiles with revision 3', async () => {
        const entries = await sut.listFiles(
            'project1',
            'repo1',
            '/test*.json',
            3
        );

        // in revision 3, `/test1.json` and `/test2.json` are included
        // Can see it in Central Dogma's WebUI too
        // http://localhost:36462/#/projects/project1/repos/repo1/list/3/
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('listFiles with revision 2', async () => {
        const entries = await sut.listFiles(
            'project1',
            'repo1',
            '/test*.json',
            2
        );

        // in revision 2, `/test2.json` is not included
        // Can see it in Central Dogma's WebUI too
        // http://localhost:36462/#/projects/project1/repos/repo1/list/2/
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
    });
});

describe('ContentService#getFiles without nested directory', () => {
    it('getFiles without pathPattern', async () => {
        const entries = await sut.getFiles('project1', 'repo1');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'bar' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('getFiles with wildcard', async () => {
        const entries = await sut.getFiles('project1', 'repo1', '/test*.json');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'bar' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('getFiles with specific path', async () => {
        const entries = await sut.getFiles('project1', 'repo1', '/test1.json');
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
    });

    it('getFiles with file path without dir', async () => {
        const entries = await sut.getFiles('project1', 'repo1', 'test*.json');
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'bar' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('getFiles with revision 3', async () => {
        const entries = await sut.getFiles(
            'project1',
            'repo1',
            '/test*.json',
            3
        );

        // in revision 3, `/test1.json` and `/test2.json` are included
        // Can see it in Central Dogma's WebUI too
        // http://localhost:36462/#/projects/project1/repos/repo1/list/3/
        expect(entries.length).toBe(2);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
        expect(entries[1].path).toBe('/test2.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'bar' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test2.json'
        );
    });

    it('getFiles with revision 2', async () => {
        const entries = await sut.getFiles(
            'project1',
            'repo1',
            '/test*.json',
            2
        );

        // in revision 2, `/test2.json` is not included
        // Can see it in Central Dogma's WebUI too
        // http://localhost:36462/#/projects/project1/repos/repo1/list/2/
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
        );
    });
});

describe('ContentService#listFiles with nested directory', () => {
    it('listFiles without pathPattern', async () => {
        const entries = await sut.listFiles('project1', 'repo2');
        expect(entries.length).toBe(4);

        // If you don't specify `pathPattern`, directories will be included
        expect(entries[0].path).toBe('/dir1');
        expect(entries[0].type).toBe('DIRECTORY');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1'
        );

        expect(entries[1].path).toBe('/dir1/test4.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );

        expect(entries[2].path).toBe('/dir1/test5.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );

        expect(entries[3].path).toBe('/test3.json');
        expect(entries[3].type).toBe('JSON');
        expect(entries[3].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });

    it('listFiles with wildcard', async () => {
        const entries = await sut.listFiles('project1', 'repo2', '/**/*.json');
        expect(entries.length).toBe(3);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
        expect(entries[1].path).toBe('/dir1/test5.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );
        expect(entries[2].path).toBe('/test3.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });

    it('listFiles with specific path', async () => {
        const entries = await sut.listFiles(
            'project1',
            'repo2',
            '/dir1/test4.json'
        );
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
    });

    it('listFiles with file path without dir', async () => {
        const entries = await sut.listFiles('project1', 'repo2', 'test*.json');
        expect(entries.length).toBe(3);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
        expect(entries[1].path).toBe('/dir1/test5.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );
        expect(entries[2].path).toBe('/test3.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });
});

describe('ContentService#getFiles with nested directory', () => {
    it('getFiles without pathPattern', async () => {
        const entries = await sut.getFiles('project1', 'repo2');
        expect(entries.length).toBe(4);

        // If you don't specify `pathPattern`, directories will be included
        expect(entries[0].path).toBe('/dir1');
        expect(entries[0].type).toBe('DIRECTORY');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1'
        );

        expect(entries[1].path).toBe('/dir1/test4.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'test4.json in dir1' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );

        expect(entries[2].path).toBe('/dir1/test5.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].content).toEqual({ field1: 'test5.json in dir1' });
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );

        expect(entries[3].path).toBe('/test3.json');
        expect(entries[3].type).toBe('JSON');
        expect(entries[3].content).toEqual({ field1: 'baz' });
        expect(entries[3].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });

    it('getFiles with wildcard', async () => {
        const entries = await sut.getFiles('project1', 'repo2', '/**/*.json');
        expect(entries.length).toBe(3);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'test4.json in dir1' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
        expect(entries[1].path).toBe('/dir1/test5.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'test5.json in dir1' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );
        expect(entries[2].path).toBe('/test3.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].content).toEqual({ field1: 'baz' });
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });

    it('getFiles with specific path', async () => {
        const entries = await sut.getFiles(
            'project1',
            'repo2',
            '/dir1/test4.json'
        );
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'test4.json in dir1' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
    });

    it('getFiles with file path without dir', async () => {
        const entries = await sut.getFiles('project1', 'repo2', 'test*.json');
        expect(entries.length).toBe(3);
        expect(entries[0].path).toBe('/dir1/test4.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'test4.json in dir1' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test4.json'
        );
        expect(entries[1].path).toBe('/dir1/test5.json');
        expect(entries[1].type).toBe('JSON');
        expect(entries[1].content).toEqual({ field1: 'test5.json in dir1' });
        expect(entries[1].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/dir1/test5.json'
        );
        expect(entries[2].path).toBe('/test3.json');
        expect(entries[2].type).toBe('JSON');
        expect(entries[2].content).toEqual({ field1: 'baz' });
        expect(entries[2].url).toBe(
            '/api/v1/projects/project1/repos/repo2/contents/test3.json'
        );
    });
});

describe('ContentService#getFile', () => {
    it('getFile', async () => {
        const entry = await sut.getFile('project1', 'repo1', {
            path: '/test1.json',
            type: QueryTypes.Identity,
        });
        expect(entry.path).toBe('/test1.json');
        expect(entry.content).toEqual({
            field1: 'foo',
        });
    });
});

describe('ContentService#getHistory with nested directory', () => {
    it('get HEAD revision without "from" from "/**"', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            to: 'HEAD',
        });

        // if you call the function without "from", it returns one commit
        expect(commits.length).toBe(1);
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();
    });

    it('get specific revision without "from" from "/**"', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            to: '4',
        });

        // if you call the function without "from", it returns one commit
        expect(commits.length).toBe(1);
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();
    });

    it('get between specific revision and HEAD from "/**"', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            from: '1',
            to: 'HEAD',
        });

        // if you call the function with "from", it returns multiple commits
        expect(commits.length).toBe(3);

        // 1st
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();

        // 2nd
        expect(commits[1].revision).toBe(3);
        expect(commits[1].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[1].commitMessage).toEqual({
            summary: 'Add /test4.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[1].pushedAt).toBeTruthy();

        // 3rd
        expect(commits[2].revision).toBe(2);
        expect(commits[2].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[2].commitMessage).toEqual({
            summary: 'Add /test3.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[1].pushedAt).toBeTruthy();
    });

    it('get between specific revision and specific revision from "/**"', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            from: '1',
            to: '4',
        });

        // if you call the function with "from", it returns multiple commits
        expect(commits.length).toBe(3);

        // 1st
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();

        // 2nd
        expect(commits[1].revision).toBe(3);
        expect(commits[1].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[1].commitMessage).toEqual({
            summary: 'Add /test4.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[1].pushedAt).toBeTruthy();

        // 3rd
        expect(commits[2].revision).toBe(2);
        expect(commits[2].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[2].commitMessage).toEqual({
            summary: 'Add /test3.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[1].pushedAt).toBeTruthy();
    });

    it('get HEAD revision from the specific directory', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            pathPattern: '/dir1/*',
            to: 'HEAD',
        });

        // if you call the function without "from", it returns one commit
        expect(commits.length).toBe(1);
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();
    });

    it('get between specific revision and HEAD from the specific directory', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            pathPattern: '/dir1/*',
            from: '1',
            to: 'HEAD',
        });

        // if you call the function with "from", it returns multiple commits
        expect(commits.length).toBe(2);

        // 1st
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();

        // 2nd
        expect(commits[1].revision).toBe(3);
        expect(commits[1].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[1].commitMessage).toEqual({
            summary: 'Add /test4.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[1].pushedAt).toBeTruthy();
    });

    it('get HEAD revision from the specific file', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            pathPattern: '/dir1/test5.json',
            to: 'HEAD',
        });

        // if you call the function without "from", it returns one commit
        expect(commits.length).toBe(1);
        expect(commits[0].revision).toBe(4);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test5.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();
    });

    it('get specific revision from the specific file', async () => {
        const commits = await sut.getHistory({
            project: 'project1',
            repo: 'repo2',
            pathPattern: '/dir1/test4.json',
            to: '3',
        });

        // if you call the function without "from", it returns one commit
        expect(commits.length).toBe(1);
        expect(commits[0].revision).toBe(3);
        expect(commits[0].author).toEqual({
            name: 'admin',
            email: 'admin@localhost.localdomain',
        });
        expect(commits[0].commitMessage).toEqual({
            summary: 'Add /test4.json',
            detail: '',
            markup: 'PLAINTEXT',
        });
        expect(commits[0].pushedAt).toBeTruthy();
    });
});

describe('ContentService#getDiffs', () => {
    it('get between specific revision and HEAD from "/**"', async () => {
        const changes = await sut.getDiffs({
            project: 'project1',
            repo: 'repo2',
            from: '1',
            to: 'HEAD',
        });

        expect(changes.length).toBe(3);

        // 1st
        expect(changes[0].path).toBe('/dir1/test4.json');
        expect(changes[0].type).toBe('UPSERT_JSON');
        expect(changes[0].content).toEqual({
            field1: 'test4.json in dir1',
        });

        // 2nd
        expect(changes[1].path).toBe('/dir1/test5.json');
        expect(changes[1].type).toBe('UPSERT_JSON');
        expect(changes[1].content).toEqual({
            field1: 'test5.json in dir1',
        });

        // 3rd
        expect(changes[2].path).toBe('/test3.json');
        expect(changes[2].type).toBe('UPSERT_JSON');
        expect(changes[2].content).toEqual({
            field1: 'baz',
        });
    });

    it('get between specific revision and specific revision from the specific directory', async () => {
        const changes = await sut.getDiffs({
            project: 'project1',
            repo: 'repo2',
            pathPattern: '/dir1/*',
            from: '3',
            to: 'HEAD',
        });

        expect(changes.length).toBe(1);

        expect(changes[0].path).toBe('/dir1/test5.json');
        expect(changes[0].type).toBe('UPSERT_JSON');
        expect(changes[0].content).toEqual({
            field1: 'test5.json in dir1',
        });
    });
});
