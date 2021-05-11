import { Author } from './projectService';
import { CentralDogmaClient } from './centralDogmaClient';

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
    client: CentralDogmaClient;

    constructor(client: CentralDogmaClient) {
        this.client = client;
    }
}
