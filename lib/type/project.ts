import { Author } from './author';

export type Project = {
    name: string;
    creator?: Author;
    url?: string;
    createdAt?: string;
};
