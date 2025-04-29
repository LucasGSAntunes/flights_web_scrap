import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { IScraper } from '../../domain/contracts/IScraper';
import { ScrapedData } from '../../domain/entities/ScrapedData';

puppeteer.use(StealthPlugin());

export class TurkishAirlinesScraper implements IScraper {
  async scrap(url: string): Promise<ScrapedData> {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000
      });

      const selectors = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      return Array.from(elements).map(el => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + (el.className ? `.${el.className.split(' ').join('.')}` : ''));
      });

      console.log('Loaded selectors:', selectors);


      await page.waitForSelector('#fromPort', { timeout: 10000 });

      await page.click('#fromPort');
      await page.keyboard.type('São Paulo');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter');

      await page.click('#toPort');
      await page.keyboard.type('Dubai');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter');

      const date = new Date();
      date.setDate(date.getDate() + 10);
      const dayOfMonth = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const formatted = `${dayOfMonth}.${month}.${date.getFullYear()}`;

      await page.click('.hm__style_calendarPlaceholderDefaultText__1xJ2y');
      
      await page.waitForSelector('div.react-calendar__month-view:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)', { timeout: 10000 });
      
      await page.click('button.react-calendar__navigation__arrow:nth-child(3)');

      const desiredDay = await page.evaluate(() => {
        const xpathResult = document.evaluate(
          '//div[contains(@class, "ui-datepicker-group")][2]//a[text()="10"]',
          document,
          null,
          XPathResult.FIRST_ORDERED_NODE_TYPE,
          null
        );
        return xpathResult.singleNodeValue as HTMLElement | null;
      });

      if (desiredDay) {
        await page.evaluate((el) => el.click(), desiredDay);
      } else {
        throw new Error('Data desejada não encontrada no calendário.');
      }
      if (desiredDay) {
        await desiredDay.click();
      } else {
        throw new Error('Data desejada não encontrada no calendário.');
      }

      await page.click('#executeSingleCitySubmit_s_1');

      await page.waitForSelector('.av__style_remove-shadow__0PD1L', { timeout: 30000 });

      const results = await page.$$eval('.av__style_remove-shadow__0PD1L', cards =>
        cards.map(card => {
          const time = card.querySelector('[class*=time]')?.textContent?.trim() || 'n/a';
          const price = card.querySelector('[class*=price]')?.textContent?.trim() || 'n/a';
          return { time, price };
        })
      );

      return {
        id: 0,
        content: results.map((r, i) => `Voo ${i + 1}: ${r.time} - ${r.price}`),
        metadata: results,
        source: 'Turkish Airlines',
        data: results.map((r, i) => ({ time: r.time, price: r.price }))
      };
    } catch (error) {
      throw new Error(`Erro ao scrapear Turkish Airlines: ${error}`);
    } finally {
      await browser.close();
    }
  }
}
