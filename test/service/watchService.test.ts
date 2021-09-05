import { constants as http2constants } from 'http2';
import { exec } from 'child_process';
import { HttpClient } from '../../lib/internal/httpClient';
import {
    ChangeTypes,
    ContentService,
    QueryTypes,
    RepositoryService,
    WatchResult,
    WatchService,
} from '../../lib';

const { HTTP_STATUS_NOT_MODIFIED } = http2constants;

const client = new HttpClient({
    baseURL: 'http://localhost:36462',
});
const contentService = new ContentService(client);
const repositoryService = new RepositoryService(client);
const sut = new WatchService(client, contentService);

describe('WatchService', () => {
    async function sleep(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    it('watchFileInner does not return `Not Modified(304)` response', async () => {
        const project = 'project1';
        const repo = 'repo1';
        const path = '/test1.json';
        const entry = await contentService.getFile({
            project,
            repo: 'repo1',
            query: {
                path,
                type: QueryTypes.Identity,
            },
        });
        const revision = entry.revision ?? -1;

        try {
            const timeoutSeconds = 3;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await sut.watchFileInner(
                project,
                repo,
                path,
                revision,
                timeoutSeconds,
            );

            // If no error occurs, let this test fail
            expect(true).toBe(false);
        } catch (e) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const statusCode = e.statusCode;
            if (statusCode) {
                expect(statusCode).toBe(HTTP_STATUS_NOT_MODIFIED);
            } else {
                // If another error occurs, let this test fail
                expect(true).toBe(false);
            }
        }
    }, 10_000);

    it('watchFile', async () => {
        const project = 'project2';
        const repo = 'repo2';
        const filePath = '/test8.json';

        const emitter = await sut.watchFile({
            project,
            repo,
            filePath,
        });

        let count = 0;
        emitter.on('data', (data: WatchResult) => {
            count++;
            console.log(`data=${JSON.stringify(data)}`);

            expect(data.entry.path).toBe(filePath);
        });
        emitter.on('error', (e) => {
            console.log(`error=${JSON.stringify(e)}`);
            throw e;
        });

        setTimeout(() => {
            // The target updates the json three times
            exec('make update-test-data-for-watchFile', (e) => {
                if (e) {
                    // fail
                    expect(true).toBe(false);
                }
            });
        }, 1_000);

        await sleep(15_000);

        expect(count).toBe(4); // initial entry + updated three times = 4 times
    }, 30_000);

    it('watchRepo', async () => {
        const project = 'project5';
        const repoName = 'repo1';
        const pathPattern = '/**';

        const repos = await repositoryService.list(project);
        expect(repos.length).toBe(3);

        const repo = repos.filter((repo) => repo.name === repoName);
        const lastKnownRevision = repo[0].headRevision ?? 1;

        const emitter = await sut.watchRepo({
            project,
            repo: repoName,
            pathPattern,
            lastKnownRevision,
        });

        let count = 0;
        emitter.on('data', (data: WatchResult) => {
            count++;
            console.log(`data=${JSON.stringify(data)}`);

            // expect(data.entry.path).toBe(filePath);
        });
        emitter.on('error', (e) => {
            console.log(`error=${JSON.stringify(e)}`);
            throw e;
        });

        setTimeout(() => {
            // The target updates the json three times
            exec('make update-test-data-for-watchRepo', (e) => {
                if (e) {
                    // fail
                    expect(true).toBe(false);
                }
            });
        }, 1_000);

        await sleep(20_000);

        expect(count).toBe(4); // initial entry + updated three times = 4 times

        await contentService.push({
            project,
            repo: repoName,
            baseRevision: 'HEAD',
            commitMessage: {
                summary: 'Remove the test file',
            },
            changes: [
                {
                    path: '/a.json',
                    type: ChangeTypes.Remove,
                },
            ],
        });
    }, 30_000);
});
