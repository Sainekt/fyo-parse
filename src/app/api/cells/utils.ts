import fs from 'fs';

const CELL_ID = '17bbadc0-786b-11ec-0a80-06bd004b0ee2';

interface ResultObject {
    dublicate: { name: string; cell: string; stock: number }[];
    clear: { cell: string }[];
    empty: { name: string; cell: string; stock: number }[];
}
interface Attribute {
    id: string;
    name: string;
    type: string;
    value: string;
}
interface DataObj {
    rows: Array<{ name: string; stock: number; attributes: Attribute[] }>;
}
export async function getData(data: DataObj): Promise<ResultObject> {
    const allCells = await allExistsCells();
    const result: ResultObject = {
        dublicate: [],
        clear: [],
        empty: [],
    };
    const unique = new Set<string>();
    console.log(data.rows.length);

    for (const product of data.rows) {
        const name: string = product.name;
        const stock: number = product.stock;
        const cell: string | null = getCellFromProduct(product.attributes);
        if (!cell) continue;
        else if (unique.has(cell)) {
            result.dublicate.push({ name: name, cell: cell, stock: stock });
            continue;
        } else if (stock === 0) {
            result.empty.push({ name: name, cell: cell, stock: stock });
        }
        unique.add(cell);
        allCells.delete(cell);
    }
    for (const cell of allCells) {
        result.clear.push({ cell: cell });
    }
    return result;
}

function getCellFromProduct(array: Attribute[]): string | null {
    if (!array) {
        return null;
    }

    let result: string | null = null;
    for (const attr of array) {
        if (attr.id === CELL_ID) {
            result = attr.value;
        }
    }
    return result;
}

async function* getAllCells(includeSet: Set<string>) {
    for (let col = 1; col < 140; col++) {
        for (let row = 1; row < 19; row++) {
            const result = `${col}-${row}`;
            if (
                (((67 <= col && col <= 74) || (100 <= col && col <= 112)) &&
                    13 < row) ||
                includeSet.has(result)
            ) {
                continue;
            }
            yield result;
        }
    }
}

async function allExistsCells(): Promise<Set<string>> {
    const result: Set<string> = new Set();
    try {
        const fileData = fs.readFileSync('./include_cells.txt', 'utf8');
        const includeSet = new Set(fileData.split('\r\n'));
        for await (const cell of getAllCells(includeSet)) {
            result.add(cell);
        }
    } catch (error) {
        console.error('includes file error:', error);
    }
    return result;
}
