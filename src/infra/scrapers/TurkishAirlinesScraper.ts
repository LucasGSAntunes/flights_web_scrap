import { chromium, Page } from 'playwright';
import { IScraper } from '../../domain/contracts/IScraper';
import { ScrapedData } from '../../domain/entities/ScrapedData';
import { FlightTextParser } from '../../domain/helpers/FlightTextParser';
import { FlightSearchParams } from '../../domain/entities/FlightSearchParams';
import { FlightSegment } from '../../domain/entities/FlightSearchParams';

export class TurkishAirlinesScraper implements IScraper {
  async scrap(params: FlightSearchParams): Promise<ScrapedData> {
    const browser = await chromium.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/135.0.0.0 Safari/537.36',
      bypassCSP: true,
    });

    await context.setExtraHTTPHeaders({
      accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8',
      referer: 'https://www.turkishairlines.com/',
      'upgrade-insecure-requests': '1',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'cache-control': 'max-age=0',
    });

    context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    const home = await context.newPage();
    await home.goto('https://www.turkishairlines.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await home.close();

    const page = await context.newPage();
    try {
      await this.navigateAndFill(page, params);
      await page.waitForTimeout(2000); 

      if (params.isMultiCity && params.segments) {
        await this.fillMultiCitySegments(page, params.segments);
      } else {
        await this.selectDate(page, params.departureDate);
        if (params.isRoundTrip && params.returnDate) {
          await this.selectDate(page, params.returnDate, params.departureDate);
        }
      }
      

      await this.setPassengers(
        page,
        params.adults ?? 0,
        params.children ?? 0,
        params.infants ?? 0,
        params.students ?? 0
      );

      await page.click('button.hm__RoundAndOneWayTab_searchButton__vpLcA');
      await page.waitForTimeout(10000);

      const flights = await page.$$eval(
        'div.av__FlightPanel_flightList__gxfmQ > div[role="listitem"]',
        (items) =>
          items.map((item) => ({
            id: item.id,
            testId: item.getAttribute('data-testid') || '',
            fullText: (item as HTMLElement).innerText.trim(),
          }))
      );

      return {
        source: 'Turkish Airlines',
        data: flights.map((f) => ({
          ...f,
          parsed: FlightTextParser.parse(f.fullText),
        })),
      };
    } finally {
      await browser.close();
    }
  }

  private async navigateAndFill(page: Page, params: FlightSearchParams) {
    await page.goto(params.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(2000);
    await page.click('#allowCookiesButton');

    await page.click('#fromPort');
    await page.fill('#fromPort', params.from);
    await page.waitForTimeout(2000);
    await page.click('div.hm__RoundAndOneWayTab_ports__3_I8l ul > li');
    
    await page.click('#toPort');
    await page.fill('#toPort', params.to);
    await page.waitForTimeout(2000);
    await page.click('div.hm__RoundAndOneWayTab_ports__3_I8l ul > li');

    await page.focus('#bookerDatepicker .hm__style_oneway-container__GXitn');
    await page.waitForTimeout(1000);
  }

  private async selectDate(page: Page, dateStr: string, arrivalTime?: string) {
    const target = new Date(dateStr);
    
    let today = new Date();
    if (arrivalTime) {
      today = new Date(arrivalTime);
    }

    const monthsToAdvance =
      (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth());

    for (let i = 0; i < monthsToAdvance; i++) {
      await page.click('button.react-calendar__navigation__arrow.react-calendar__navigation__next-button');
      await page.waitForTimeout(300);
    }

    const day = target.getDate();
    await page.click(`.react-calendar__month-view__days button:has(abbr:text("${day+1}"))`);
    await page.waitForTimeout(300);
  }

  private async setPassengers(page: Page, adults: number, children: number, infants: number, students: number) {
    await page.click('#bookerFlightPaxpicker');
    await page.waitForTimeout(500);
  
    const adjust = async (type: string, desired: number) => {
      const wrapper = await page.$(`#bookerFlightPaxPicker${type} > div.hm__style_booker-pax-picker-item-count-container__Ochtv.hm__grid_col-5__o4lUG`);
      if (!wrapper) return;
  
      const currentText = await wrapper.innerText();
      const currentMatch = currentText.match(/\d+/);
      const current = currentMatch ? parseInt(currentMatch[0], 10) : 0;
  
      const increaseBtn = `#bookerFlightPaxPickerPlus${type}`;
      const decreaseBtn = `#bookerFlightPaxPickerMinus${type}`;
      const delta = desired - current;
      const button = delta > 0 ? increaseBtn : decreaseBtn;
  
      for (let i = 0; i < Math.abs(delta); i++) {
        await page.click(button);
        await page.waitForTimeout(500);
      }
      await page.waitForTimeout(1000);
    };
  
    await adjust('Adult', adults);
    await adjust('Child', children);
    await adjust('Infant', infants);
    await adjust('Student', students);
  }

  private async fillMultiCitySegments(page: Page, segments: FlightSegment[]) {
    await page.click('#multi-city');
    await page.waitForTimeout(1000);
  
    for (let i = 0; i < segments.length; i++) {
      const container = await page.$$(`.hm__MultiCityTab_flightIndex__ydg5_`);
      const segmentEl = container[i];
      if (!segmentEl) continue;
  
      const { from, to, date } = segments[i];
  
      const fromInput = await segmentEl.$('input[aria-label="From"]');
      await fromInput?.click();
      await fromInput?.fill(from);
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
  
      const toInput = await segmentEl.$('input[aria-label="To"]');
      await toInput?.click();
      await toInput?.fill(to);
      await page.waitForTimeout(500);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
  
      const dateInput = await segmentEl.$('input[type="text"][placeholder*="Select date"]');
      await dateInput?.click();
      await this.selectDate(page, date);
    }
  }
  
  
}