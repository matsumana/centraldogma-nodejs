import http2 from 'http2';
import { EventEmitter } from 'events';
import { HttpClient } from './internal/httpClient';
import { ContentService, Entry } from './contentService';

const {
    HTTP2_HEADER_IF_NONE_MATCH,
    HTTP2_HEADER_PREFER,
    HTTP_STATUS_NOT_MODIFIED,
} = http2.constants;

const REQUEST_HEADER_PREFER_SECONDS_DEFAULT = 60;

export type WatchResult = {
    entry: Entry;
};

export class WatchService {
    private readonly httpClient: HttpClient;
    private readonly contentService: ContentService;

    constructor(httpClient: HttpClient, contentService: ContentService) {
        this.httpClient = httpClient;
        this.contentService = contentService;
    }

    watchFile(
        project: string,
        repo: string,
        filePath: string,
        timeoutSeconds?: number
    ): EventEmitter {
        const emitter = new EventEmitter();

        setImmediate(async () => {
            // get the current entry
            const entry = await this.contentService.getFile(
                project,
                repo,
                filePath
            );
            const currentEntry: WatchResult = {
                entry,
            };
            emitter.emit('data', currentEntry);

            // start watching
            const watch = async (revision: number) => {
                let currentRevision = revision;
                try {
                    const watchResult = await this.watchFileInner(
                        project,
                        repo,
                        filePath,
                        currentRevision,
                        timeoutSeconds ?? REQUEST_HEADER_PREFER_SECONDS_DEFAULT
                    );
                    currentRevision = watchResult.entry.revision ?? -1;
                    emitter.emit('data', watchResult);
                } catch (e) {
                    // TODO: implement exponential backoff with jitter
                    if (e.statusCode !== HTTP_STATUS_NOT_MODIFIED) {
                        emitter.emit('error', e);
                    }
                } finally {
                    setImmediate(() => {
                        watch(currentRevision);
                    });
                }
            };
            const currentRevision = entry.revision ?? -1;
            setImmediate(() => {
                watch(currentRevision);
            });
        });

        return emitter;
    }

    private async watchFileInner(
        project: string,
        repo: string,
        filePath: string,
        revision: number,
        timeoutSeconds?: number
    ): Promise<WatchResult> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents/${filePath}`;
        const prefer = `wait=${
            timeoutSeconds ?? REQUEST_HEADER_PREFER_SECONDS_DEFAULT
        }`;
        const headers = {
            [HTTP2_HEADER_IF_NONE_MATCH]: revision,
            [HTTP2_HEADER_PREFER]: prefer,
        };
        const response = await this.httpClient.request(path, headers);
        const entry: Entry = response.body
            ? JSON.parse(response.body).entry ?? {}
            : {};
        return {
            entry,
        };
    }

    async watchRepo(): Promise<WatchResult> {
        throw new Error('not implemented');
    }
}
