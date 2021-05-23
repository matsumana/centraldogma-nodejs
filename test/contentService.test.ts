import { HttpClient } from '../lib/internal/httpClient';
import { ContentService } from '../lib';

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const sut = new ContentService(client);

describe('ContentService without nested directory', () => {
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

    it('getFile', async () => {
        const entry = await sut.getFile('project1', 'repo1', '/test1.json');
        expect(entry.path).toBe('/test1.json');
        expect(entry.content).toEqual({
            field1: 'foo',
        });
    });
});

describe('ContentService with nested directory', () => {
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

        expect(entries.length).toBe(4);
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
