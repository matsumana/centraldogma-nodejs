import http2 from 'http2';
import { CentralDogmaClient, ContentService, WatchService } from '../lib';

const { HTTP_STATUS_NOT_MODIFIED } = http2.constants;

describe('WatchService', () => {
    async function sleep(milliseconds: number) {
        return new Promise((resolve) => setTimeout(resolve, milliseconds));
    }

    it('watchFileInner returns Not Modified(304) response', async () => {
        const client = new CentralDogmaClient({
            baseURL: 'http://localhost:36462',
        });
        const sut = new WatchService(client);

        const project = 'project1';
        const repo = 'repo1';
        const filePath = '/test1.json';
        const contentService = new ContentService(client);
        const [entry] = await contentService.getFile(project, repo, filePath);
        const revision = entry.revision ?? -1;

        try {
            const timeoutSeconds = 3;

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            await sut.watchFileInner(
                project,
                repo,
                filePath,
                revision,
                timeoutSeconds
            );

            // If no error occurs, let this test fail
            expect(true).toBe(false);
        } catch (e) {
            expect(e.statusCode).toBe(HTTP_STATUS_NOT_MODIFIED);
        }
    }, 10_000);

    it('watchFile', async () => {
        const client = new CentralDogmaClient({
            baseURL: 'http://localhost:36462',
        });
        const sut = new WatchService(client);

        const project = 'project1';
        const repo = 'repo1';
        const filePath = '/test3.json';

        const emitter = sut.watchFile(project, repo, filePath);
        emitter.on('data', (data) => {
            console.log(`data=${JSON.stringify(data)}`);
        });

        await sleep(90_000);
    }, 90_000);
});
