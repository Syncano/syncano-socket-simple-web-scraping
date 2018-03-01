import cheerio from 'cheerio';
import request from 'request';
import openScraping from 'openscraping';
import EasyXml from 'easyxml';

const report = (extract, scraped) => {
  if (extract === 'xml') {
    const serializer = new EasyXml({
      singularize: true,
      rootElement: 'response',
      dateFormat: 'ISO',
      manifest: true
    });
    return serializer.render(scraped);
  } if (extract === 'json') {
    return scraped;
  } return 'select either xml or json extract.';
};

const scraping = (selectorType, config, extract, html) => new Promise((resolve, reject) => {
  if (selectorType === 'xpath') {
    const xpathScraping = openScraping.parse(config, html);
    return resolve(report(extract, xpathScraping));
  } if (selectorType === 'css') {
    try {
      const $ = cheerio.load(html);

      const configValue = Object.keys(config).map((value) => {
        const decodedCss = [];
        const isCssValue = $(config[value]).each((i, cssValue) => {
          decodedCss[i] = `${$(cssValue).text()}`;
        });

        try {
          if (Object.keys(config).length >= 1) {
            config[value] = $(config[value]).text() === '' ?
              `${config[value]} does not exist` :
              decodedCss.toString();
          }
        } catch (error) {
          return error.message;
        }
        return resolve(report(extract, config));
      }, {});
    } catch (error) {
      return reject(new Error());
    }
  } return reject(new Error('Enter valid information'));
});

export default scraping;
