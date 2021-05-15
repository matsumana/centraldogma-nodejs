import { HttpClient } from './internal/httpClient';
import { Author } from './projectService';

export type Repository = {
    name: string;
    creator?: Author;
    headRevision?: number;
    url?: string;
    createdAt?: string;
};

export type Rev = {
    rev: number;
};

export class RepositoryService {
    private readonly httpClient: HttpClient;

    constructor(client: HttpClient) {
        this.httpClient = client;
    }

    async create(): Promise<Repository> {
        throw new Error('not implemented');
    }

    async remove(): Promise<void> {
        throw new Error('not implemented');
    }

    async purge(): Promise<void> {
        throw new Error('not implemented');
    }

    async unremove(): Promise<Repository> {
        throw new Error('not implemented');
    }

    async list(project: string): Promise<Repository[]> {
        const path = `/api/v1/projects/${project}/repos`;
        const response = await this.httpClient.request(path);
        return response.body ? JSON.parse(response.body) : [{}];
    }

    async listRemoved(): Promise<Repository[]> {
        throw new Error('not implemented');
    }
}
