import puppeteer from 'puppeteer';

export async function getData(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const ajaxUrl = await page.evaluate(() => {
        const table = document.querySelector('table[name="flexgrid_modellen"]');
        return table ? table.getAttribute('data-ajax-url') : null;
    });
    if (!ajaxUrl) {
        return 404;
    }
    const response = await page.goto(ajaxUrl, { waitUntil: 'networkidle2' });
    const data = await response.json();
    await browser.close();
    return data;
}

export async function parseData(data) {
    const array = data.aaData;
    const result = [];
    for (const element of array) {
        const good = {};
        good['brand'] = element[0];
        good['model'] = element[1].replace(/<[^>]*>/g, '').trim();
        good['series'] = element[2];
        result.push(good);
    }
    return result;
}
