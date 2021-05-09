import http2 from 'http2';
import { Entry } from './contentService';
import { CentralDogmaClient, ContentService } from '../lib';

const { HTTP2_HEADER_IF_NONE_MATCH, HTTP2_HEADER_PREFER } = http2.constants;

const REQUEST_HEADER_PREFER_SECONDS_DEFAULT = 60;

export type WatchResult = {
    revision: number;
    entry: Entry;
};

export class WatchService {
    client: CentralDogmaClient;

    constructor(client: CentralDogmaClient) {
        this.client = client;
    }

    async watchFile(
        project: string,
        repo: string,
        filePath: string,
        timeoutSeconds?: number
    ): Promise<WatchResult> {
        const contentService = new ContentService(this.client);
        const [entry] = await contentService.getFile(project, repo, filePath);
        const revision = entry.revision ?? -1;

        let watchResult;

        // eslint-disable-next-line no-constant-condition
        while (true) {
            try {
                [watchResult] = await this.watchFileInner(
                    project,
                    repo,
                    filePath,
                    revision,
                    timeoutSeconds ?? REQUEST_HEADER_PREFER_SECONDS_DEFAULT
                );
                return watchResult;
            } catch (e) {
                // do nothing
            }
        }
    }

    private async watchFileInner(
        project: string,
        repo: string,
        filePath: string,
        revision: number,
        timeoutSeconds?: number
    ): Promise<[WatchResult, number]> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents/${filePath}`;
        const prefer = `wait=${
            timeoutSeconds ?? REQUEST_HEADER_PREFER_SECONDS_DEFAULT
        }`;
        const headers = {
            [HTTP2_HEADER_IF_NONE_MATCH]: revision,
            [HTTP2_HEADER_PREFER]: prefer,
        };
        const response = await this.client.request(path, headers);
        const entry: Entry = response.body
            ? JSON.parse(response.body).entry ?? {}
            : {};
        const watchResult: WatchResult = {
            revision: entry.revision ?? -1,
            entry,
        };
        return [watchResult, response.statusCode];
    }

    async watchRepo(): Promise<[WatchResult, number]> {
        throw new Error('not implemented');
    }
}
