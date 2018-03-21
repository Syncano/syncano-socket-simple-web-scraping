import cheerio from 'cheerio';
import request from 'request';
import openScraping from 'openscraping';
import EasyXml from 'easyxml';

const report = (extract, scraped) => {
  return new Promise((resolve, reject) => {
    if (extract === 'xml') {
      const serializer = new EasyXml({
        singularize: true,
        rootElement: 'response',
        dateFormat: 'ISO',
        manifest: true
      });
      resolve(serializer.render(scraped));
    } if (extract === 'json') {
      resolve(scraped);
    } resolve('select either xml or json extract.');
  });
};

const scraping = (selectorType, config, extract, html) => new Promise((resolve, reject) => {
  if (selectorType === 'xpath') {
    const xpathScraping = openScraping.parse(config, html);
    return resolve(report(extract, xpathScraping));
  } if (selectorType === 'css') {
    try {
      const $ = cheerio.load(html);
      Promise.all(Object.keys(config).map(async (key) => {
        const decodedCss = [];
        await $(config[key]).each((i, cssValue) => {
          decodedCss[i] = `${$(cssValue).html()}`;
        });
        config[key] = $(config[key]).text() === '' ?
          `${config[key]} does not exist` :
          decodedCss;
      }));
      resolve(report(extract, config));
    } catch (error) {
      reject(new Error());
    }
  } reject(new Error('Enter valid information'));
});

export default scraping;
