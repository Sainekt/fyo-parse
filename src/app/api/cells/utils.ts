import fs from 'fs';
import {
    DataObj,
    ResultObject,
    Attribute,
    allCells,
    ExcludeCells,
} from './interfaces';
const CELL_ID = '17bbadc0-786b-11ec-0a80-06bd004b0ee2';

export async function getData(data: DataObj): Promise<ResultObject> {
    const allCellsObj = await allExistsCells();
    const allCells = allCellsObj.allExistsCell;
    const includesCell = allCellsObj.includesCell;
    const result: ResultObject = {
        dublicate: [],
        clear: [],
        empty: [],
        countGoods: data.rows.length,
        includeSet: [...includesCell],
    };
    const unique = new Set<string>();
    for (const product of data.rows) {
        const name: string = product.name;
        const stock: number = product.stock;
        const code: string = product.code;
        const cell: string | null = getCellFromProduct(product.attributes);
        if (!cell || typeof stock === 'undefined') continue;
        else if (unique.has(cell)) {
            result.dublicate.push({
                name: name,
                cell: cell,
                stock: stock,
                code: code,
            });
            continue;
        } else if (stock === 0) {
            result.empty.push({
                name: name,
                cell: cell,
                stock: stock,
                code: code,
            });
        }
        unique.add(cell);
        allCells.delete(cell);
    }
    for (const cell of allCells) {
        result.clear.push({ name: null, cell: cell, stock: null, code: null });
    }
    return result;
}

function getCellFromProduct(array: Attribute[]): string | null {
    const regex = /^\d+-\d+/;
    if (!array) {
        return null;
    }
    let result: string | null = null;
    for (const attr of array) {
        if (attr.id === CELL_ID) {
            const cell = attr.value.match(regex);
            result = cell ? cell[0] : null;
        }
    }
    return result;
}

function* getAllCells(includeSet: Set<string>) {
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

async function allExistsCells(): Promise<allCells> {
    const result: allCells = {
        allExistsCell: new Set(),
        includesCell: new Set(),
    };
    try {
        // file.txt must be separation by CRLF format.
        const fileData = fs.readFileSync('./excluded_cells.txt', 'utf8');
        const includeSet = new Set(fileData.split('\r\n'));
        result.includesCell = includeSet;
        for (const cell of getAllCells(includeSet)) {
            result.allExistsCell.add(cell);
        }
    } catch (error) {
        console.error('includes file error:', error);
    }
    return result;
}

export async function getExcludeCells(): Promise<ExcludeCells> {
    try {
        const fileData = fs.readFileSync('./excluded_cells.txt', 'utf8');
        const excludeSet = new Set(fileData.split('\r\n'));
        return { data: [...excludeSet], error: null };
    } catch (error) {
        console.error(error);
        return { data: null, error: 'failed read eclude_cells.txt file' };
    }
}

export function addExcludeCell(cell: string): boolean {
    try {
        fs.appendFileSync('./excluded_cells.txt', `${cell}\r\n`);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export function removeExcludeCell(cell: string): boolean {
    try {
        const fileData = fs.readFileSync('./excluded_cells.txt', 'utf8');
        const lines = fileData
            .split('\r\n')
            .filter((line) => line.trim() !== cell);
        fs.writeFileSync('./excluded_cells.txt', lines.join('\r\n'));
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}
