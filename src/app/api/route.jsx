import { handler } from '../utils/puppeter';

export async function POST(request) {
    const urlPattern =
        /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    const HEADERS = {
        'Content-Type': 'application/json',
    };
    const body = await request.json();

    if (!urlPattern.test(body.url)) {
        return new Response(JSON.stringify({ detail: 'bad url' }), {
            headers: HEADERS,
            status: 400,
        });
    }

    try {
        const fyoData = await handler(body.url);
        if (fyoData.status === 404) {
            return new Response(
                JSON.stringify({ detail: 'Model list not found' }),
                {
                    status: 404,
                    headers: HEADERS,
                }
            );
        }
        if (fyoData.status === 400) {
            return new Response(JSON.stringify({ detail: 'Unknown url' }), {
                status: 400,
                headers: HEADERS,
            });
        }
        return new Response(JSON.stringify(fyoData.data), {
            headers: HEADERS,
            status: 200,
        });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({ error: 'bad request' }), {
            status: 500,
            headers: HEADERS,
        });
    }
}
