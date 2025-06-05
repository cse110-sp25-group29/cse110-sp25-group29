describe('Basic user flow for Website', () => {
  beforeAll(async() => {
    await page.goto('https://cse110-sp25-group29.github.io/project-homepage/homepage.html');
  });

  it('Check if light theme works as expected', async() => {
    console.log('Checking for light theme...');

    const bodyClass = await page.$eval('body', (body) => {
      return body.className;
    });
    expect(bodyClass).toBe('');
  });

  it('Check if toggle dark theme works as expected', async() => {
    console.log('Checking for dark theme...');

    const themeButton = await page.$('#theme-toggle');
    await themeButton.click();

    const bodyClass = await page.$eval('body', (body) => {
      return body.className;
    });
    expect(bodyClass).toBe('dark-theme');
  });

  it('How it works link is correct', async() => {
    const href = await page.$eval('.how-it-works a', el => el.href);
    expect(href).toBe('https://cse110-sp25-group29.github.io/project-homepage/homepage.html');
  });

  it('GitHub link has correct href and opens in new tab', async() => {
    const link = await page.$('.github a');
    const href = await page.evaluate(el => el.href, link);
    const target = await page.evaluate(el => el.target, link);

    expect(href).toBe('https://github.com/cse110-sp25-group29/cse110-sp25-group29');
    expect(target).toBe('_blank');
  });

  it('Our Team link has correct href and opens in new tab', async() => {
    const link = await page.$('.team a');
    const href = await page.evaluate(el => el.href, link);
    const target = await page.evaluate(el => el.target, link);

    expect(href).toBe('https://cse110-sp25-group29.github.io/cse110-sp25-group29/admin/team.html');
    expect(target).toBe('_blank');
  });
});
