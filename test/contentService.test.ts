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
        const entries = await sut.listFiles('project1', 'repo1', 'test1.json');
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
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
        const entries = await sut.getFiles('project1', 'repo1', 'test1.json');
        expect(entries.length).toBe(1);
        expect(entries[0].path).toBe('/test1.json');
        expect(entries[0].type).toBe('JSON');
        expect(entries[0].content).toEqual({ field1: 'foo' });
        expect(entries[0].url).toBe(
            '/api/v1/projects/project1/repos/repo1/contents/test1.json'
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
