const fs = require("fs");
const readline = require("readline");
const webdriver = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const chromedriver = require("chromedriver");

const chromeOptions = new chrome.Options();
chromeOptions.addArguments(["detach=true"]);
chromeOptions.detachDriver(true);
// Commented out because they are obviously not what you want.
// Uncomment and adapt as needed:
//
// chromeOptions.setChromeBinaryPath("/tmp/foo");
// chromeOptions.addArguments(["--blah"]);

async function processLineByLine() {
  const fileStream = fs.createReadStream("urls.txt");

  const urls = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in urls.txt as a single line break.

  for await (const url of urls) {
    let driver = new webdriver.Builder()
      .withCapabilities(chromeOptions)
      .setChromeService(new chrome.ServiceBuilder(chromedriver.path))
      .build();

    // Go to url
    driver.get(url);
    // Go to ssllabs for url
    driver.executeScript(
      `window.open('https://www.ssllabs.com/ssltest/analyze.html?d=${url}','_blank');`
    );
  }
}

processLineByLine();
