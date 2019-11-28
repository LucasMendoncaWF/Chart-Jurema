import { AppPage } from './app.po';
import { browser, logging } from 'protractor';
describe('workspace-project App', () => {
  let page: AppPage;
  let fs = require('fs');
  beforeEach(() => {
    page = new AppPage();
  });

  function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  }

  it("should be São Paulo", () => {
    page.navigateTo();
    expect(page.selectSaoPaulo()).toBeTruthy();
    browser.takeScreenshot().then(function (png) {
      writeScreenShot(png, 'print.png');
  });
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));

    
  });
});
