'use server';
import { HEADERS_DEFAULT } from '../../utils/constants';
import { getData } from './utils';
import { Result, ApiResponse, ResultObject, DataObj } from './interfaces';

const TOKEN: string | undefined = process.env.MS_TOKEN;
const HEADERS_FOR_MS = {
    Authorization: `Bearer ${process.env.MS_TOKEN}`,
    'Content-type': 'application/json',
};

const URL = `https://api.moysklad.ru/api/remap/1.2/entity/assortment?filter=stockStore=
https://api.moysklad.ru/api/remap/1.2/entity/store/
922bc77a-4223-11ec-0a80-05560025dbb3`;

export async function GET(): Promise<Response> {
    if (!TOKEN) {
        console.error('TOKEN is not set!!!');
        return new Response(JSON.stringify({ error: 'TOKEN is not set' }), {
            status: 500,
            headers: HEADERS_DEFAULT,
        });
    }
    const response = await fetch(URL, {
        method: 'GET',
        headers: HEADERS_FOR_MS,
    });

    if (!response.ok) {
        return new Response(
            JSON.stringify({ error: 'Mysklad response is not 200' }),
            {
                status: 500,
                headers: HEADERS_DEFAULT,
            }
        );
    }
    const allGoods: DataObj = await getAllGoods(response);
    const responseData: ResultObject = await getData(allGoods);
    return new Response(JSON.stringify({ data: responseData }), {
        status: 200,
        headers: HEADERS_DEFAULT,
    });
}

async function getAllGoods(response: Response): Promise<DataObj> {
    const result: DataObj = { rows: [] };
    const first: ApiResponse = await response.json();
    let nextUrl: string = first.meta.nextHref;
    result.rows.push(...first.rows);
    let count = 0;

    while (count < 10) {
        const newResponse = await fetch(nextUrl, {
            headers: HEADERS_FOR_MS,
            method: 'GET',
        });
        const newGoods = await newResponse.json();
        result.rows.push(...newGoods.rows);
        nextUrl = newGoods.meta.nextHref;
        if (!nextUrl) break;
        if (count === 9) console.log('I have already requested 10,000 items');
        count++;
    }
    console.log('Goods received: ', result.rows.length);
    return result;
}
