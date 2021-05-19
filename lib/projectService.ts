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

    async create(name: string): Promise<Project> {
        const response = await this.httpClient.post(PATH_PROJECT, { name });
        return response.data ? JSON.parse(response.data) : {};
    }

    async remove(name: string): Promise<void> {
        await this.httpClient.delete(`${PATH_PROJECT}/${name}`);
    }

    async purge(): Promise<void> {
        throw new Error('not implemented');
    }

    async unremove(): Promise<Project> {
        throw new Error('not implemented');
    }

    async list(): Promise<Project[]> {
        const response = await this.httpClient.get(PATH_PROJECT);
        return response.data ? JSON.parse(response.data) : [{}];
    }

    async listRemoved(): Promise<Project[]> {
        throw new Error('not implemented');
    }
}
