import { HttpClient } from './internal/httpClient';
import { Author } from './projectService';

const PATH_PREFIX = '/api/v1/projects';

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

    async create(project: string, repo: string): Promise<Repository> {
        const response = await this.httpClient.post(
            `${PATH_PREFIX}/${project}/repos`,
            {
                name: repo,
            }
        );
        return response.data ? JSON.parse(response.data) : {};
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
        const path = `${PATH_PREFIX}/${project}/repos`;
        const response = await this.httpClient.get(path);
        return response.data ? JSON.parse(response.data) : [{}];
    }

    async listRemoved(): Promise<Repository[]> {
        throw new Error('not implemented');
    }
}
