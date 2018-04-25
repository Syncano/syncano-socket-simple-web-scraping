import cheerio from 'cheerio';
import request from 'request';
import openScraping from 'openscraping';
import EasyXml from 'easyxml';
import S from 'string';

const report = (extract, scraped) => {
  return new Promise((resolve, reject) => {
    if (extract === 'xml') {
      const serializer = new EasyXml({
        singularize: true,
        rootElement: 'response',
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
      Promise.all(Object.keys(config).map((key) => {
        const decodedCss = [];
        $(config[key]).each((i, cssValue) => {
          decodedCss[i] = `${S($(cssValue).html()).unescapeHTML().s}`;
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
