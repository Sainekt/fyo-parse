import puppeteer from 'puppeteer';
import { DOMAINS } from './constants';

const browser = await puppeteer.launch({ headless: true });

export async function handler(url) {
    const domain = extractDomain(url);
    if (!DOMAINS[domain]) {
        return { status: 400, data: null };
    }
    if (DOMAINS[domain] === 'fiyo.de') return await getDataFiyo(url);
    if (DOMAINS[domain] === 'zipcom.ru') return await getDataZipcom(url);
}

const urlPattern = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;

function extractDomain(url) {
    const match = url.match(urlPattern);
    return match ? match[1] : null;
}

async function getDataFiyo(url) {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    const ajaxUrl = await page.evaluate(() => {
        const table = document.querySelector('table[name="flexgrid_modellen"]');
        return table ? table.getAttribute('data-ajax-url') : null;
    });
    if (!ajaxUrl) {
        return { status: 404, data: null };
    }
    const response = await page.goto(ajaxUrl, { waitUntil: 'networkidle2' });
    const data = await response.json();
    const parseData = await parseDataFiyo(data);
    await page.close();
    return { status: 200, data: parseData };
}

async function parseDataFiyo(data) {
    const array = data.aaData;
    const result = [];
    for (const element of array) {
        const good = {};
        good['brand'] = element[0];
        good['model'] = element[1].replace(/<[^>]*>/g, '').trim();
        good['series'] = element[2];
        result.push(good);
    }
    result.sort((a, b) => a.brand.localeCompare(b.brand));
    return result;
}

async function getDataZipcom(url) {
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });
    const array = await page.evaluate(() => {
        const table = document.querySelector('.product-fullinfo__model-list');
        if (!table) return;
        const elements = table.getElementsByTagName('a');
        const result = [];
        for (const key in elements) {
            const text = elements[key].textContent;
            result.push(text);
        }
        return result;
    });
    await page.close();
    if (!array) return { status: 404, data: null };
    const data = await parserZipComData(array);
    return { status: 200, data: data };
}

async function parserZipComData(data) {
    const result = [];
    for (const element of data) {
        if (!element) continue;
        const [brand, model, series] = element.split(' ');
        const obj = { brand, model, series };
        result.push(obj);
    }
    return result;
}
