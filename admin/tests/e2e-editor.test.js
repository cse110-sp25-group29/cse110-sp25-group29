describe('Basic user flow for Website', () => {
  beforeAll(async() => {
    await page.goto('https://cse110-sp25-group29.github.io/cse110-sp25-group29/source/assets/editor-page.html');
  });

  it('Check if home button goes to correct destination', async() => {
    console.log('Checking the destination...');
    await page.waitForSelector('#home-button');
    await page.click('#home-button');
    expect(page.url()).toBe('https://cse110-sp25-group29.github.io/cse110-sp25-group29/source/assets/homepage.html');
  });
});
