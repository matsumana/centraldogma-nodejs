import { HttpClient } from '../internal/httpClient';
import { Project } from '../type/project';

const PATH_PROJECT = '/api/v1/projects';

export class ProjectService {
    private readonly httpClient: HttpClient;

    constructor(client: HttpClient) {
        this.httpClient = client;
    }

    async create(project: string): Promise<Project> {
        const response = await this.httpClient.post(PATH_PROJECT, {
            name: project,
        });
        return response.data ? JSON.parse(response.data) : {};
    }

    async remove(project: string): Promise<void> {
        await this.httpClient.delete(`${PATH_PROJECT}/${project}`);
    }

    async purge(project: string): Promise<void> {
        await this.httpClient.delete(`${PATH_PROJECT}/${project}/removed`);
    }

    async unRemove(project: string): Promise<Project> {
        const body = [{ op: 'replace', path: '/status', value: 'active' }];
        const response = await this.httpClient.patch(
            `${PATH_PROJECT}/${project}`,
            body,
        );
        return response.data ? JSON.parse(response.data) : {};
    }

    async list(): Promise<Project[]> {
        const response = await this.httpClient.get(PATH_PROJECT);
        return response.data ? JSON.parse(response.data) : [{}];
    }

    async listRemoved(): Promise<Project[]> {
        const response = await this.httpClient.get(
            `${PATH_PROJECT}?status=removed`,
        );
        return response.data ? JSON.parse(response.data) : [{}];
    }
}
