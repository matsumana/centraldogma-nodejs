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
    client: HttpClient;

    constructor(client: HttpClient) {
        this.client = client;
    }
}
