import Syncano from 'syncano-server';
import scraping from './utility';

const rp = require('request-promise');

export default async (ctx) => {
  const { response } = Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;

  const {
    url,
    extract,
    selectorType,
    ...config
  } = ctx.args;

  try {
    if (requestMethod === 'GET') {
      const options = {
        uri: url,
        transform: (html => scraping(selectorType, config, extract, html))
      };

      return rp(options)
        .then((data) => {
          response.json({
            message: 'Webpage Scraped.',
            statusCode: 200,
            data
          });
        })
        .catch((error) => {
          response.json({ message: error.message });
        });
    } throw new Error('not available');
  } catch (error) {
    response.json({
      message: 'Make sure to use GET request method for scraping webpage',
      statusCode: 400,
      data: error
    });
  }
};
