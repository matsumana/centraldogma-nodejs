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

    async remove(project: string, repo: string): Promise<void> {
        await this.httpClient.delete(`${PATH_PREFIX}/${project}/repos/${repo}`);
    }

    async purge(project: string, repo: string): Promise<void> {
        await this.httpClient.delete(
            `${PATH_PREFIX}/${project}/repos/${repo}/removed`
        );
    }

    async unRemove(project: string, repo: string): Promise<Repository> {
        const body = [{ op: 'replace', path: '/status', value: 'active' }];
        const response = await this.httpClient.patch(
            `${PATH_PREFIX}/${project}/repos/${repo}`,
            body
        );
        return response.data ? JSON.parse(response.data) : {};
    }

    async list(project: string): Promise<Repository[]> {
        const response = await this.httpClient.get(
            `${PATH_PREFIX}/${project}/repos`
        );
        return response.data ? JSON.parse(response.data) : [{}];
    }

    async listRemoved(project: string): Promise<Repository[]> {
        const response = await this.httpClient.get(
            `${PATH_PREFIX}/${project}/repos?status=removed`
        );
        return response.data ? JSON.parse(response.data) : [{}];
    }
}
