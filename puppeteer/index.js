import puppeteer from 'puppeteer';

/**
 * PuDocumentation: https://pptr.dev/
 * Calling puppeteer from Cypress: https://github.com/cypress-io/cypress/issues/2427
 */
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:5173/?db=bob');
    await page.setViewport({width: 1080, height: 1024});
    const settings = await page.waitForSelector('[data-cy=settings]');
    await settings.click();
    const myAddress = await page.waitForSelector('[data-cy=address]');
    await myAddress.click()
    await page.locator('[data-cy=txtFirstname]').fill('Bob')
    await page.locator('[data-cy=txtLastname]').fill('Smith')
    await page.locator('[data-cy=txtStreet]').fill('225 Broadway')
    await page.locator('[data-cy=txtZipCode]').fill('NY 10007-3001')
    await page.locator('[data-cy=txtCity]').fill('New York')
    await page.locator('[data-cy=txtCountry]').fill('USA')
    // await page.locator('input[type="checkbox"]').click()
    const check = await page.$('[data-cy=chkMyOwn] > input[type="checkbox"]')
    await check.click()
    // await page.locator('[data-cy=chkMyOwn] > input[type="checkbox"]').click()
    // await page.$eval('input[type="checkbox"]', check => check.checked = true);
    const addButton = await page.locator('[data-cy=addContact]')
    addButton.click()
    // await page.locator('table > tbody > tr > td').contains('Bob')

    // Type into search box
    // await page.type('.search-box__input', 'automate beyond recorder');
    //
    // // Wait and click on first result
    // const searchResultSelector = '.search-box__link';
    // await page.waitForSelector(searchResultSelector);
    // await page.click(searchResultSelector);
    //
    // // Locate the full title with a unique string
    // const textSelector = await page.waitForSelector(
    //     'text/Customize and automate'
    // );
    // const fullTitle = await textSelector?.evaluate(el => el.textContent);
    //
    // // Print the full title
    // console.log('The title of this blog post is "%s".', fullTitle);

    // await browser.close();
})();