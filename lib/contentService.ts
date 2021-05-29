import { constants as http2constants } from 'http2';
import { HttpClient } from './internal/httpClient';
import { Author } from './projectService';

const { HTTP_STATUS_OK } = http2constants;

export const QueryTypes = {
    Identity: 1,
    // TODO add support jsonpath
    // JSONPath: 2,
} as const;
export type QueryType = typeof QueryTypes[keyof typeof QueryTypes];

export const ChangeTypes = {
    UpsertJson: 'UPSERT_JSON',
    UpsertText: 'UPSERT_TEXT',
    Remove: 'REMOVE',
    Rename: 'RENAME',
    // TODO add support patch
    // ApplyJsonPatch: 'APPLY_JSON_PATCH',
    // ApplyTextPatch: 'APPLY_TEXT_PATCH',
} as const;
export type ChangeType = typeof ChangeTypes[keyof typeof ChangeTypes];

export const EntryTypes = {
    JSON: 'JSON',
    TEXT: 'TEXT',
    DIRECTORY: 'DIRECTORY',
} as const;
export type EntryType = typeof EntryTypes[keyof typeof EntryTypes];

export type ParamsGetHistory = {
    project: string;
    repo: string;
    pathPattern?: string;
    from?: string;
    to: string;
    maxCommits?: number;
};

export type ParamsGetDiffs = {
    project: string;
    repo: string;
    pathPattern?: string;
    from: string;
    to: string;
};

export type ParamsPush = {
    project: string;
    repo: string;
    baseRevision: string;
    commitMessage: CommitMessage;
    changes: Change[];
};

export type Query = {
    path: string;
    type: QueryType;
    expressions?: string[];
};

export type Entry = {
    path: string;
    type: EntryType;
    content?: string;
    revision?: number;
    url?: string;
    modifiedAt?: string;
};

export type PushResult = {
    revision: number;
    pushedAt: string;
};

export type Commit = {
    revision: number;
    author?: Author;
    commitMessage?: CommitMessage;
    pushedAt?: string;
};

export type CommitMessage = {
    summary: string;
    detail?: string;
    markup?: string;
};

export type Change = {
    path: string;
    type: ChangeType;
    content?: unknown;
};

export class ContentService {
    private readonly httpClient: HttpClient;

    constructor(client: HttpClient) {
        this.httpClient = client;
    }

    async listFiles(
        project: string,
        repo: string,
        pathPattern?: string,
        revision?: number
    ): Promise<Entry[]> {
        return await this.filesInner(
            'list',
            project,
            repo,
            pathPattern,
            revision
        );
    }

    async getFile(
        project: string,
        repo: string,
        query: Query,
        revision?: number
    ): Promise<Entry> {
        // TODO add support jsonpath
        const revisionQuery = revision ? `?revision=${revision}` : '';
        const requestPath = `/api/v1/projects/${project}/repos/${repo}/contents/${query.path}${revisionQuery}`;
        const response = await this.httpClient.get(requestPath);
        return response.data ? JSON.parse(response.data) : null;
    }

    async getFiles(
        project: string,
        repo: string,
        pathPattern?: string,
        revision?: number
    ): Promise<Entry[]> {
        return await this.filesInner(
            'contents',
            project,
            repo,
            pathPattern,
            revision
        );
    }

    async getHistory(params: ParamsGetHistory): Promise<Commit[]> {
        const from = params.from ?? '';
        const obj = {
            path: params.pathPattern ?? '/**',
            to: params.to,
            maxCommits: params.maxCommits ?? 3,
        };
        const query =
            '?' +
            Object.entries(obj)
                .map((element) => `${element[0]}=${element[1]}`)
                .join('&');
        const requestPath = `/api/v1/projects/${params.project}/repos/${params.repo}/commits/${from}${query}`;
        const response = await this.httpClient.get(requestPath);
        return response.statusCode === HTTP_STATUS_OK && response.data
            ? JSON.parse(response.data)
            : [];
    }

    async getDiff(): Promise<Change> {
        // TODO add support jsonpath
        throw new Error('not implemented');
    }

    async getDiffs(params: ParamsGetDiffs): Promise<Change[]> {
        const obj = {
            path: params.pathPattern ?? '/**',
            from: params.from,
            to: params.to,
        };
        const query =
            '?' +
            Object.entries(obj)
                .map((element) => `${element[0]}=${element[1]}`)
                .join('&');
        const requestPath = `/api/v1/projects/${params.project}/repos/${params.repo}/compare${query}`;
        const response = await this.httpClient.get(requestPath);
        return response.data ? JSON.parse(response.data) : [];
    }

    async push(params: ParamsPush): Promise<PushResult> {
        const query = `?revision=${params.baseRevision}`;
        const requestPath = `/api/v1/projects/${params.project}/repos/${params.repo}/contents${query}`;
        const body = {
            commitMessage: params.commitMessage,
            changes: params.changes,
        };
        const response = await this.httpClient.post(requestPath, body);
        return response.data ? JSON.parse(response.data) : null;
    }

    private async filesInner(
        action: string,
        project: string,
        repo: string,
        pathPattern?: string,
        revision?: number
    ): Promise<Entry[]> {
        if (!pathPattern) {
            pathPattern = '/**';
        } else {
            if (!pathPattern.startsWith('/')) {
                pathPattern = '/**/' + pathPattern;
            }
        }
        const revisionQuery = revision ? `?revision=${revision}` : '';
        const path = `/api/v1/projects/${project}/repos/${repo}/${action}${pathPattern}${revisionQuery}`;
        const response = await this.httpClient.get(path);
        const data = response.data ? JSON.parse(response.data) : [];
        return Array.isArray(data) ? data : [data];
    }
}
