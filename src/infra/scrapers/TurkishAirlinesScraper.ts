// src/scrapers/TurkishAirlinesScraper.ts
import { chromium } from 'playwright';
import { IScraper } from '../../domain/contracts/IScraper';
import { ScrapedData } from '../../domain/entities/ScrapedData';

export class TurkishAirlinesScraper implements IScraper {
  async scrap(url: string): Promise<ScrapedData> {
    const browser = await chromium.launch({
      headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
      ],
    });

    const context = await browser.newContext({
      // Emula um browser real em tela grande
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/135.0.0.0 Safari/537.36',
      // ignora CSP para garantir que todos os estilos e scripts carreguem
      bypassCSP: true,
    });

    // faz parecer uma sessão legítima
    await context.setExtraHTTPHeaders({
      accept:
        'text/html,application/xhtml+xml,application/xml;' +
        'q=0.9,image/avif,image/webp,*/*;q=0.8',
      'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8',
      referer: 'https://www.turkishairlines.com/',
      'upgrade-insecure-requests': '1',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'cache-control': 'max-age=0',
    });

    // simples “stealth” caseiro para remover navigator.webdriver
    context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    // 1) Visita a home para pegar cookies iniciais
    const home = await context.newPage();
    await home.goto('https://www.turkishairlines.com/', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });
    await home.close();

    // 2) Abre a página de busca
    const page = await context.newPage();
    try {
      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });

      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(2000);

      await page.click('#allowCookiesButton');

      await page.click('input#fromPort');
      await page.fill('input#fromPort', 'São Paulo');
      await page.waitForTimeout(500);

      await page.click('input#toPort');
      await page.fill('input#toPort', 'Dubai');
      await page.waitForTimeout(2000);
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);

      await page.focus('#bookerDatepicker > div > div > div > div > div.hm__style_oneway-container__GXitn');
      await page.waitForTimeout(2000);
      await page.click('#bookerDatepicker > div > div > div > div > div.hm__style_calendar-modal-wrapper__3QAFq.hm__style_priceCalendar___JR62.hm__RoundAndOneWayTab_roundAndOneWayWrapper__Ro0xw > div.hm__RoundAndOneWayTab_roundAndOneWayCalendarWrapper__gBIJj > div.hm__style_customNavigation__lRsM1 > div > div:nth-child(1) > div > button')
      await page.waitForTimeout(2000);
      await page.click('#bookerDatepicker > div > div > div > div > div.hm__style_calendar-modal-wrapper__3QAFq.hm__style_priceCalendar___JR62.hm__RoundAndOneWayTab_roundAndOneWayWrapper__Ro0xw > div.hm__RoundAndOneWayTab_roundAndOneWayCalendarWrapper__gBIJj > div.hm__style_customNavigation__lRsM1 > div > div:nth-child(1) > div > div > button:nth-child(5)')
      await page.waitForTimeout(2000);
      await page.click('#bookerDatepicker > div > div > div > div > div.hm__style_calendar-modal-wrapper__3QAFq.hm__style_priceCalendar___JR62.hm__RoundAndOneWayTab_roundAndOneWayWrapper__Ro0xw > div.hm__RoundAndOneWayTab_roundAndOneWayCalendarWrapper__gBIJj > div.react-calendar.react-calendar--doubleView.hm__style_booker-date__QsKy0 > div > div:nth-child(1) > div > div > div.react-calendar__month-view__days > button:nth-child(1)')
      await page.waitForTimeout(2000);
      await page.click('#bookerDatepicker > div > div > div > div > div.hm__style_calendar-modal-wrapper__3QAFq.hm__style_priceCalendar___JR62.hm__RoundAndOneWayTab_roundAndOneWayWrapper__Ro0xw > div.hm__RoundAndOneWayTab_roundAndOneWayCalendarWrapper__gBIJj > div.react-calendar.react-calendar--doubleView.hm__style_booker-date__QsKy0 > div > div:nth-child(2) > div > div > div.react-calendar__month-view__days > button:nth-child(4)')
      await page.waitForTimeout(2000);
      await page.click('#__next > div > main > div > div.container.hm__DesktopBooker_desktopBookerContainer__z37b2.hm__grid_container__lwCcM.hm__style_custom-container__iwkmp > div > div > div.hm__style_tabs__2FWgE.hm__style_light__0_PUi.hm__style_normal__1wz_Q.hm__DesktopBooker_tabs__aqQRN > div:nth-child(2) > div > div > div > div.hm__FlightBooker_bookerContent__JjWa5 > div > div.hm__RoundAndOneWayTab_buttonWrapper__v15PI > button');
      await page.waitForTimeout(10000);      

      const flights = await page.$$eval(
        'div.av__FlightPanel_flightList__gxfmQ > div[role="listitem"]',
        items =>
          items.map(item => ({
            id: item.id,
            testId: item.getAttribute('data-testid') || '',
            fullText: (item as HTMLElement).innerText.trim(),
          }))
      );
      
      return {
        source: 'Turkish Airlines',
        data: flights,
      };
    } finally {
      await browser.close();
    }
  }
}
