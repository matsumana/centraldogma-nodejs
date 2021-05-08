import { Author } from './projectService';
import { CentralDogmaClient } from './centralDogmaClient';

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
    client: CentralDogmaClient;

    constructor(client: CentralDogmaClient) {
        this.client = client;
    }

    async listFiles(project: string, repo: string): Promise<[Entry[], number]> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents`;
        const response = await this.client.request(path);
        const entries: Entry[] = response.body
            ? JSON.parse(response.body)
            : [{}];
        return [entries, response.statusCode];
    }

    async getFile(
        project: string,
        repo: string,
        filePath: string
    ): Promise<[Entry, number]> {
        const path = `/api/v1/projects/${project}/repos/${repo}/contents/${filePath}`;
        const response = await this.client.request(path);
        const entries: Entry = response.body ? JSON.parse(response.body) : {};
        return [entries, response.statusCode];
    }

    async getFiles(): Promise<[Entry[], number]> {
        throw new Error('not implemented');
    }

    async getHistory(): Promise<[Commit[], number]> {
        throw new Error('not implemented');
    }

    async getDiff(): Promise<[Change, number]> {
        throw new Error('not implemented');
    }

    async getDiffs(): Promise<[Change[], number]> {
        throw new Error('not implemented');
    }

    async push(): Promise<[PushResult, number]> {
        throw new Error('not implemented');
    }
}
