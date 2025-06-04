describe('Basic user flow for Website', () => {
  // First, visit the editor page
  beforeAll(async () => {
    await page.goto('https://cse110-sp25-group29.github.io/cse110-sp25-group29/source/assets/editor-page.html');
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
});
