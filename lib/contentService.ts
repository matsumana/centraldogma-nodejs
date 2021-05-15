import { HttpClient } from './internal/httpClient';
import { Author } from './projectService';

export type Query = {
    path: string;
    type: number;
    expressions: string[];
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

    async listFiles(project: string, repo: string): Promise<Entry[]> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents`;
        const response = await this.httpClient.request(path);
        return response.body ? JSON.parse(response.body) : [{}];
    }

    async getFile(
        project: string,
        repo: string,
        filePath: string
    ): Promise<Entry> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents/${filePath}`;
        const response = await this.httpClient.request(path);
        return response.body ? JSON.parse(response.body) : {};
    }

    async getFiles(): Promise<Entry[]> {
        throw new Error('not implemented');
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
}
