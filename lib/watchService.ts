import http2 from 'http2';
import { EventEmitter } from 'events';
import { CentralDogmaClient } from './centralDogmaClient';
import { ContentService, Entry } from './contentService';

const {
    HTTP2_HEADER_IF_NONE_MATCH,
    HTTP2_HEADER_PREFER,
    HTTP_STATUS_NOT_MODIFIED,
} = http2.constants;

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

    watchFile(
        project: string,
        repo: string,
        filePath: string,
        timeoutSeconds?: number
    ): EventEmitter {
        const emitter = new EventEmitter();

        setTimeout(() => {
            (async () => {
                const contentService = new ContentService(this.client);
                const [entry] = await contentService.getFile(
                    project,
                    repo,
                    filePath
                );
                let revision = entry.revision ?? -1;

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    try {
                        const [watchResult] = await this.watchFileInner(
                            project,
                            repo,
                            filePath,
                            revision,
                            timeoutSeconds ??
                                REQUEST_HEADER_PREFER_SECONDS_DEFAULT
                        );

                        revision = watchResult.revision;

                        emitter.emit('data', watchResult);
                    } catch (e) {
                        if (e.statusCode !== HTTP_STATUS_NOT_MODIFIED) {
                            throw e;
                        }
                    }
                }
            })();
        }, 0);

        return emitter;
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
