const { chromium } = require('playwright');

describe('Complete Purchase Flow on SauceDemo', () => {
  let browser;
  let context;
  let page; 

  beforeAll(async () => {
    browser = await chromium.launch({
      headless: false,
      slowMo: 100 
    });
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });


    test(
    'Login, add to cart, complete checkout flow',
    async () => {
      await page.goto('https://www.saucedemo.com/');
      await page.type('#user-name', 'standard_user', { delay: 500 });
      await page.type('#password', 'secret_sauce', { delay: 500 });
      await page.click('#login-button');
      await page.waitForURL('**/inventory.html');

      await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');

      await page.click('.shopping_cart_link');
      await page.waitForURL('**/cart.html');

      await page.click('[data-test="checkout"]');

      await page.type('[data-test="firstName"]', 'Supritha');
      await page.type('[data-test="lastName"]', 'Patil');
      await page.type('[data-test="postalCode"]', '84318');

      await page.click('[data-test="continue"]');
      await page.waitForURL('**/checkout-step-two.html');

      await page.click('[data-test="finish"]');
      await page.waitForURL('**/checkout-complete.html');

      const confirmation = await page.textContent('.complete-header');
      expect(confirmation).toContain('Thank you for your order!');

      await page.screenshot({ path: 'confirmation_page.png' });
    },
     60000
  );
   test('Invalid login shows error message', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.type('#user-name', 'standard_user');
    await page.type('#password', 'wrong_password');
    await page.click('#login-button');
    const error = await page.textContent('[data-test="error"]');
    expect(error).toContain('Username and password do not match');
  }, 3000);
    test('Login fails with empty username and password', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.click('#login-button');
    const error = await page.textContent('[data-test="error"]');
    expect(error).toContain('Username is required');
  }, 3000);
  test('Add multiple items and verify cart count', async () => {
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.waitForURL('**/inventory.html');

    await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
    await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');

    const count = await page.textContent('.shopping_cart_badge');
    expect(count).toBe('3');
  }, 150000);
//   test('Remove item from cart before checkout', async () => {
//     await page.goto('https://www.saucedemo.com/');
//     await page.fill('#user-name', 'standard_user');
//     await page.fill('#password', 'secret_sauce');
//     await page.click('#login-button');
//     await page.waitForURL('**/inventory.html');

//     await page.waitForSelector('[data-test="add-to-cart-sauce-labs-backpack"]');
//     await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
//     await page.waitForSelector('[data-test="add-to-cart-sauce-labs-bike-light"]');
//     await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');

//     await page.click('.shopping_cart_link');
//     await page.waitForURL('**/cart.html');

    


//     await page.click('[data-test="remove-sauce-labs-backpack"]');
//     const cartItems = await page.$$('.cart_item');
//     expect(cartItems.length).toBe(1);
//   }, 150000);


});
