describe('Basic user flow for Website', () => {
  beforeAll(async() => {
    await page.goto('https://cse110-sp25-group29.github.io/cse110-sp25-group29/source/assets/editor-page.html');
  });

  it('Check if light theme works as expected', async() => {
    console.log('Checking for light theme...');

    // Finds the class name of the body tag
    const bodyClass = await page.$eval('body', (body) => {
      return body.className;
    });
    expect(bodyClass).toBe('');
  });
});
