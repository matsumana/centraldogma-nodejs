export const EntryTypes = {
    JSON: 'JSON',
    TEXT: 'TEXT',
    DIRECTORY: 'DIRECTORY',
} as const;
export type EntryType = typeof EntryTypes[keyof typeof EntryTypes];

export type Entry = {
    path: string;
    type: EntryType;
    content?: string;
    revision?: number;
    url?: string;
    modifiedAt?: string;
};
