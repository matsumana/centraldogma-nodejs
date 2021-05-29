import { constants as http2constants } from 'http2';
import { EventEmitter } from 'events';
import { HttpClient } from './internal/httpClient';
import { ContentService, Entry, QueryTypes } from './contentService';

const {
    HTTP2_HEADER_IF_NONE_MATCH,
    HTTP2_HEADER_PREFER,
    HTTP_STATUS_NOT_MODIFIED,
} = http2constants;

const REQUEST_HEADER_PREFER_SECONDS_DEFAULT = 60;

export type ParamsWatchFile = {
    project: string;
    repo: string;
    filePath: string;
    timeoutSeconds?: number;
};

export type ParamsWatchRepo = {
    project: string;
    repo: string;
    pathPattern: string;
    lastKnownRevision: number;
    timeoutSeconds?: number;
};

export type WatchResult = {
    revision: number;
    entry: Entry;
};

export class WatchService {
    private readonly httpClient: HttpClient;
    private readonly contentService: ContentService;

    constructor(httpClient: HttpClient, contentService: ContentService) {
        this.httpClient = httpClient;
        this.contentService = contentService;
    }

    watchFile(params: ParamsWatchFile): EventEmitter {
        const emitter = new EventEmitter();

        setImmediate(async () => {
            // get the current entry
            const entry = await this.contentService.getFile({
                project: params.project,
                repo: params.repo,
                query: {
                    path: params.filePath,
                    type: QueryTypes.Identity,
                },
            });
            const currentEntry: WatchResult = {
                revision: entry.revision ?? 1,
                entry,
            };
            emitter.emit('data', currentEntry);

            // start watching
            const watch = async (revision: number) => {
                let currentRevision = revision;
                try {
                    const watchResult = await this.watchFileInner(
                        params.project,
                        params.repo,
                        params.filePath,
                        currentRevision,
                        params.timeoutSeconds ??
                            REQUEST_HEADER_PREFER_SECONDS_DEFAULT
                    );
                    currentRevision = watchResult.revision;
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

    watchRepo(params: ParamsWatchRepo): EventEmitter {
        const emitter = new EventEmitter();

        setImmediate(async () => {
            // start watching
            const watch = async (revision: number) => {
                let currentRevision = revision;
                try {
                    const watchResult = await this.watchFileInner(
                        params.project,
                        params.repo,
                        params.pathPattern,
                        currentRevision,
                        params.timeoutSeconds ??
                            REQUEST_HEADER_PREFER_SECONDS_DEFAULT
                    );
                    currentRevision = watchResult.revision;
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
            setImmediate(() => {
                watch(params.lastKnownRevision);
            });
        });

        return emitter;
    }

    private async watchFileInner(
        project: string,
        repo: string,
        path: string,
        revision: number,
        timeoutSeconds?: number
    ): Promise<WatchResult> {
        const requestPath = `/api/v1/projects/${project}/repos/${repo}/contents/${path}`;
        const prefer = `wait=${
            timeoutSeconds ?? REQUEST_HEADER_PREFER_SECONDS_DEFAULT
        }`;
        const headers = {
            [HTTP2_HEADER_IF_NONE_MATCH]: revision,
            [HTTP2_HEADER_PREFER]: prefer,
        };
        const response = await this.httpClient.get(requestPath, headers);
        return response.data ? JSON.parse(response.data) : {};
    }
}
