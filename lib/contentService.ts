import { HttpClient } from './internal/httpClient';
import { Author } from './projectService';

export const QueryTypes = {
    Identity: 1,
    JSONPath: 2,
} as const;
export type QueryType = typeof QueryTypes[keyof typeof QueryTypes];

export type Query = {
    path: string;
    type: QueryType;
    expressions?: string[];
};

export type Entry = {
    path: string;
    type: number;
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
    type: number;
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
        return response.data ? JSON.parse(response.data) : {};
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

    async getHistory(): Promise<Commit[]> {
        throw new Error('not implemented');
    }

    async getDiff(): Promise<Change> {
        throw new Error('not implemented');
    }

    async getDiffs(): Promise<Change[]> {
        throw new Error('not implemented');
    }

    async push(): Promise<PushResult> {
        throw new Error('not implemented');
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
        const data = response.data ? JSON.parse(response.data) : [{}];
        return Array.isArray(data) ? data : [data];
    }
}
