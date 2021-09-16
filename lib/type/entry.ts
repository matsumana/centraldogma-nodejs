export const EntryTypes = {
    Json: 'JSON',
    Text: 'TEXT',
    Directory: 'DIRECTORY',
} as const;
export type EntryType = typeof EntryTypes[keyof typeof EntryTypes];

export type Entry = {
    path: string;
    type: EntryType;
    /**
     * content is parsed value or object when the type is `JSON`, otherwise string
     */
    content?: unknown;
    revision?: number;
    url?: string;
    modifiedAt?: string;
};
