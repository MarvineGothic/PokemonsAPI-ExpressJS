
export type Filter = {
    gt?: number;
    lt?: number;
    gte?: number;
    lte?: number;
    eq?: number;
}

export type Query = {
    page?: string;
    limit?: number;
    name?: string;
    hp?: any;
    defense?: any;
    attack?: any;
}