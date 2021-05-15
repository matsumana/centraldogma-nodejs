import { HttpClient } from './internal/httpClient';
import { Author, Project } from './projectService';

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

    async create(): Promise<[Repository, number]> {
        throw new Error('not implemented');
    }

    async remove(): Promise<number> {
        throw new Error('not implemented');
    }

    async purge(): Promise<number> {
        throw new Error('not implemented');
    }

    async unremove(): Promise<[Repository, number]> {
        throw new Error('not implemented');
    }

    async list(project: string): Promise<[Repository[], number]> {
        const path = `/api/v1/projects/${project}/repos`;
        const response = await this.httpClient.request(path);
        const projects: Project[] = response.body
            ? JSON.parse(response.body)
            : [{}];
        return [projects, response.statusCode];
    }

    async listRemoved(): Promise<[Repository[], number]> {
        throw new Error('not implemented');
    }
}
