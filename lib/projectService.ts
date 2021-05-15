import { HttpClient } from './internal/httpClient';

const PATH_PROJECT = '/api/v1/projects';

export type Project = {
    name: string;
    creator?: Author;
    url?: string;
    createdAt?: string;
};

export type Author = {
    name?: string;
    email?: string;
};

export class ProjectService {
    private readonly httpClient: HttpClient;

    constructor(client: HttpClient) {
        this.httpClient = client;
    }

    async create(): Promise<Project> {
        throw new Error('not implemented');
    }

    async remove(): Promise<void> {
        throw new Error('not implemented');
    }

    async purge(): Promise<void> {
        throw new Error('not implemented');
    }

    async unremove(): Promise<Project> {
        throw new Error('not implemented');
    }

    async list(): Promise<Project[]> {
        const response = await this.httpClient.request(PATH_PROJECT);
        return response.body ? JSON.parse(response.body) : [{}];
    }

    async listRemoved(): Promise<Project[]> {
        throw new Error('not implemented');
    }
}
