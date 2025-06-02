describe('Basic user flow for Website', () => {
  // First, visit the homepage
  beforeAll(async () => {
    await page.goto('https://cse110-sp25-group29.github.io/project-homepage/homepage.html');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  
  it('Check if light theme works as expected', async () => {
    console.log('Checking for light theme...');

    //Finds the class name of the body tag
    const bodyClass = await page.$eval('body', (body) => {
        return body.className;
    });
    expect(bodyClass).toBe("");
  });

  it('Check if toggle dark theme works as expected', async () => {
    console.log('Checking for dark theme...');

    const themeButton = await page.$('#theme-toggle');
    await themeButton.click();


    const bodyClass = await page.$eval('body', (body) => {
        return body.className;
    });
    expect(bodyClass).toBe("dark-theme");
  });
});
