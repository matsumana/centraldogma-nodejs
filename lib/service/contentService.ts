import { constants as http2constants } from 'http2';
import { HttpClient } from '../internal/httpClient';
import { CommitMessage } from '../type/commitMessage';
import { Entry } from '../type/entry';
import { Change } from '../type/change';
import { Query } from '../type/query';
import { Commit } from '../type/commit';
import { PushResult } from '../type/pushResult';

const { HTTP_STATUS_OK } = http2constants;

export type ParamsListFiles = {
    project: string;
    repo: string;
    pathPattern?: string;
    revision?: number;
};

export type ParamsGetFile = {
    project: string;
    repo: string;
    query: Query;
    revision?: number;
};

export type ParamsGetFiles = {
    project: string;
    repo: string;
    pathPattern?: string;
    revision?: number;
};

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

export class ContentService {
    private readonly httpClient: HttpClient;

    constructor(client: HttpClient) {
        this.httpClient = client;
    }

    async listFiles(params: ParamsListFiles): Promise<Entry[]> {
        return await this.filesInner(
            'list',
            params.project,
            params.repo,
            params.pathPattern,
            params.revision,
        );
    }

    async getFile(params: ParamsGetFile): Promise<Entry> {
        // TODO add support jsonpath
        const revisionQuery = params.revision
            ? `?revision=${params.revision}`
            : '';
        const requestPath = `/api/v1/projects/${params.project}/repos/${params.repo}/contents/${params.query.path}${revisionQuery}`;
        const response = await this.httpClient.get(requestPath);
        return response.data ? JSON.parse(response.data) : null;
    }

    async getFiles(params: ParamsGetFiles): Promise<Entry[]> {
        return await this.filesInner(
            'contents',
            params.project,
            params.repo,
            params.pathPattern,
            params.revision,
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
        revision?: number,
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
