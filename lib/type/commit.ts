import { Author } from './author';
import { CommitMessage } from './commitMessage';

export type Commit = {
    revision: number;
    author?: Author;
    commitMessage?: CommitMessage;
    pushedAt?: string;
};
