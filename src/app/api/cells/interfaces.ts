export interface Result {
    rows: Good[];
}

interface Good {
    id: string;
    name: string;
}

export interface ApiResponse {
    rows: Array<{
        name: string;
        stock: number;
        attributes: Attribute[];
        code: string;
    }>;
    meta: {
        nextHref: string;
    };
}

export interface ResultObject {
    dublicate: { name: string; cell: string; stock: number; code: string }[];
    clear: { name: null; cell: string; stock: null; code: null }[];
    empty: { name: string; cell: string; stock: number; code: string }[];
    countGoods: number;
    includeSet: Array<string>;
}
export interface Attribute {
    id: string;
    name: string;
    type: string;
    value: string;
}
export interface DataObj {
    rows: Array<{
        name: string;
        stock: number;
        attributes: Attribute[];
        code: string;
    }>;
}

export interface allCells {
    allExistsCell: Set<string>;
    includesCell: Set<string>;
}

export interface ExcludeCells {
    data: Array<string> | null;
    error: string | null;
}
