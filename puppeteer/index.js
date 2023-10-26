import puppeteer from 'puppeteer';

(async () => {
    // Launch the browser and open a new blank page
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto('http://localhost:5173/');

    // Set screen size
    await page.setViewport({width: 1080, height: 1024});
    // await page.waitForSelector('[data-cy=settings]');

    // Query for an element handle.
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
    await page.locator('[data-cy=chkMyOwn] > input').click()
    await page.locator('[data-cy=addContact]').click()
    await page.locator('table > tbody > tr > td').contains('Bob')

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