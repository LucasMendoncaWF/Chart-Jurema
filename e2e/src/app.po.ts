import { browser, by, element } from 'protractor';
import {WriteStream} from 'fs';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  selectSaoPaulo() {
     element(by.cssContainingText('.select-uf option', 'São Paulo')).click();
     browser.driver.sleep(500);
     element(by.cssContainingText('.select-municipio option', 'São Paulo')).click();
     browser.driver.sleep(5000);
     return true;
  }
}