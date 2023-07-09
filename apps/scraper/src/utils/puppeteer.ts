import puppeteer, { Browser, Page } from "puppeteer-core"

export let browser: Browser
export let page: Page

export const initBrowser = async () => {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: process.env.CHROME_PATH,
      headless: true,
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage"
      ]
    })
  }
  if (!page)
    page = await browser.newPage()
}

export const closeBrowser = async () => {
  await browser.close()
  page = null
}
