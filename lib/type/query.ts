export const QueryTypes = {
    Identity: 1,
    // TODO add support jsonpath
    // JSONPath: 2,
} as const;
export type QueryType = typeof QueryTypes[keyof typeof QueryTypes];

export type Query = {
    path: string;
    type: QueryType;
    expressions?: string[];
};
