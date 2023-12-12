import puppetteer from "puppeteer";
import { fork } from "child_process";

jest.setTimeout(60000); // default puppeteer timeout

describe("Credit Card Validator form", () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = "http://localhost:8080";

  beforeEach(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on("error", reject);
      server.on("message", (message) => {
        if (message === "ok") {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      headless: "new", // show gui
      slowMo: 10,
      devtools: false, // show devTools
    });
    page = await browser.newPage();
    page.on("dialog", async (dialog) => {
      console.log("dialog");
      await dialog.accept();
    });
  });
  test("check written geolocation with space", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(baseUrl, ["geolocation"]);
    await page.goto(baseUrl);
    const input = await page.$("input");
    await input.type("1235");
    await page.keyboard.press("Enter");
    await page.setGeolocation({ latitude: 90, longitude: 0 });
    const inputModal = await page.$(".modal__input");
    const btnOkModal = await page.$(".btn_ok");
    await inputModal.type("51.50851,0.12572");
    await btnOkModal.click();
  });
  test("check written geolocation without space", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(baseUrl, ["geolocation"]);
    await page.goto(baseUrl);
    const input = await page.$("input");
    await input.type("1235");
    await page.keyboard.press("Enter");
    await page.setGeolocation({ latitude: 90, longitude: 0 });
    const inputModal = await page.$(".modal__input");
    const btnOkModal = await page.$(".btn_ok");
    await inputModal.type("51.50851,-0.12572");
    await btnOkModal.click();
  });
  test("check written geolocation without brackets", async () => {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(baseUrl, ["geolocation"]);
    await page.goto(baseUrl);
    const input = await page.$("input");
    await input.type("1235");
    await page.keyboard.press("Enter");
    await page.setGeolocation({ latitude: 90, longitude: 0 });
    const inputModal = await page.$(".modal__input");
    const btnOkModal = await page.$(".btn_ok");
    await inputModal.type("[-51.50851,-0.12572]");
    await btnOkModal.click();
  });

  afterEach(async () => {
    await browser.close();
    await server.kill();
  });
});
