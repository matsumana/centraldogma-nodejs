import { Author } from './author';

export type Repository = {
    name: string;
    creator?: Author;
    headRevision?: number;
    url?: string;
    createdAt?: string;
};
