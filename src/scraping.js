import Syncano from '@syncano/core';
import rp from 'request-promise';
import scraping from './utility';

export default async (ctx) => {
  const { response } = new Syncano(ctx);
  const requestMethod = ctx.meta.request.REQUEST_METHOD;

  const {
    url,
    extract,
    selectorType,
    config
  } = ctx.args;

  try {
    if (requestMethod === 'POST') {
      const options = {
        uri: url,
        transform: (async (html) => {
          const result = await scraping(selectorType, config, extract, html);
          return result;
        })
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
      message: 'Make sure to use POST request method for scraping webpage',
      statusCode: 400,
      data: error
    });
  }
};
