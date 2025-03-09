import { HEADERS_DEFAULT } from '../../../utils/constants';
import { getExcludeCells, addExcludeCell, removeExcludeCell } from '../utils';

export async function GET(): Promise<Response> {
    const excludeData = await getExcludeCells();
    if (excludeData.error || !excludeData.data) {
        return new Response(JSON.stringify({ error: excludeData.error }), {
            status: 500,
            headers: HEADERS_DEFAULT,
        });
    }
    const sortedData = getSortedData(excludeData.data);
    const response = sortedData.map((value) => {
        return { cell: value };
    });

    return new Response(JSON.stringify({ data: response }), {
        status: 200,
        headers: HEADERS_DEFAULT,
    });
}

export async function POST(request: Request): Promise<Response> {
    const body = await request.json();
    const regex = /^\d+-\d+/;
    if (!regex.test(body['cell'])) {
        new Response(
            JSON.stringify({ data: null, error: 'Не правильний формат даних' }),
            {
                status: 400,
                headers: HEADERS_DEFAULT,
            }
        );
    }
    const cell = body.cell.trim();
    const excludeData = await getExcludeCells();
    if (excludeData.error || !excludeData.data) {
        return new Response(JSON.stringify({ error: excludeData.error }), {
            status: 500,
            headers: HEADERS_DEFAULT,
        });
    }
    if (excludeData.data.includes(cell)) {
        return new Response(
            JSON.stringify({ data: null, error: 'Ячейка уже добавлена.' }),
            { status: 400, headers: HEADERS_DEFAULT }
        );
    }
    if (!addExcludeCell(cell)) {
        return new Response(
            JSON.stringify({
                data: null,
                error: 'Ошибка при записи в файл excluded-cells.txt',
            }),
            { status: 500, headers: HEADERS_DEFAULT }
        );
    }
    return new Response(null, { status: 201, headers: HEADERS_DEFAULT });
}

export async function DELETE(request: Request): Promise<Response> {
    const body = await request.json();
    const regex = /^\d+-\d+/;
    if (!regex.test(body['cell'])) {
        new Response(
            JSON.stringify({ data: null, error: 'Не правильний формат даних' }),
            {
                status: 400,
                headers: HEADERS_DEFAULT,
            }
        );
    }
    const cell = body.cell.trim();
    const excludeData = await getExcludeCells();
    if (excludeData.error || !excludeData.data) {
        return new Response(JSON.stringify({ error: excludeData.error }), {
            status: 500,
            headers: HEADERS_DEFAULT,
        });
    }
    if (!excludeData.data.includes(cell)) {
        return new Response(
            JSON.stringify({
                data: null,
                error: 'Ячейка не добавлена.',
            }),
            { status: 400, headers: HEADERS_DEFAULT }
        );
    }
    if (!removeExcludeCell(cell)) {
        return new Response(
            JSON.stringify({
                data: null,
                error: 'Ошибка удалении записи из файла excluded-cells.txt',
            }),
            { status: 500, headers: HEADERS_DEFAULT }
        );
    }
    return new Response(null, { status: 204, headers: HEADERS_DEFAULT });
}

function getSortedData(data: string[]): Array<string> {
    const result = data.sort((a: string, b: string) => {
        const hasDashA = a.indexOf('-') !== -1;
        const hasDashB = b.indexOf('-') !== -1;
        if (!hasDashA && !hasDashB) return 0;
        if (!hasDashA) return 1;
        if (!hasDashB) return -1;
        const numberA = Number(a.slice(0, a.indexOf('-')));
        const numberB = Number(b.slice(0, b.indexOf('-')));
        return numberA - numberB;
    });
    return result;
}
