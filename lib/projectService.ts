import { CentralDogmaClient } from '../lib';

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
    client: CentralDogmaClient;

    constructor(client: CentralDogmaClient) {
        this.client = client;
    }

    async create(): Promise<[Project, number]> {
        throw new Error('not implemented');
    }

    async remove(): Promise<number> {
        throw new Error('not implemented');
    }

    async purge(): Promise<number> {
        throw new Error('not implemented');
    }

    async unremove(): Promise<[Project, number]> {
        throw new Error('not implemented');
    }

    async list(): Promise<[Project[], number]> {
        const response = await this.client.request(PATH_PROJECT);
        const projects: Project[] = response.body
            ? JSON.parse(response.body)
            : [{}];
        return [projects, response.statusCode];
    }

    async listRemoved(): Promise<[Project[], number]> {
        throw new Error('not implemented');
    }
}
