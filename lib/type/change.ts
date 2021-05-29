export const ChangeTypes = {
    UpsertJson: 'UPSERT_JSON',
    UpsertText: 'UPSERT_TEXT',
    Remove: 'REMOVE',
    Rename: 'RENAME',
    // TODO add support patch
    // ApplyJsonPatch: 'APPLY_JSON_PATCH',
    // ApplyTextPatch: 'APPLY_TEXT_PATCH',
} as const;
export type ChangeType = typeof ChangeTypes[keyof typeof ChangeTypes];

export type Change = {
    path: string;
    type: ChangeType;
    content?: unknown;
};
