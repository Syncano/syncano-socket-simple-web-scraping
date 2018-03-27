import { assert, expect } from 'chai';
import { run, generateMeta } from '@syncano/test';

const meta = generateMeta('scraping');
let args = {};

describe('WEBPAGE SCRAPING WITH XPATH AND CSS SELECTORS', () => {
  describe('scrape webpage using xpath selector and return json or xml', () => {
    const url = 'https://funnycatsgallery.com/';
    it('throws an error when GET request method is passed', (done) => {
      args = {
        url
      };
      meta.request.REQUEST_METHOD = 'GET';
      run('scraping', { meta, args })
        .then((response) => {
          expect(response.data.message)
            .to.equal('Make sure to use POST request method for scraping webpage');
          done();
        });
    });

    it('returns xpath scraped webpage in JSON format', (done) => {
      args = {
        url,
        selectorType: 'xpath',
        config: { title: "//*[@id='content_box']/article/header/h2/a/text()" },
        extract: 'json'
      };
      meta.request.REQUEST_METHOD = 'POST';
      run('scraping', {
        meta,
        args
      })
        .then((response) => {
          expect(response.data.message).to.equal('Webpage Scraped.');
          expect(response.data.data)
            .to.have.property('title').to.be.an('Array').that.is.not.empty;
          done();
        });
    });

    it('returns xpath scraped webpage in XML format', (done) => {
      args = {
        url,
        selectorType: 'xpath',
        config: { title: "//*[@id='content_box']/article/header/h2/a/text()" },
        extract: 'xml'
      };
      meta.request.REQUEST_METHOD = 'POST';
      run('scraping', {
        meta,
        args
      })
        .then((response) => {
          expect(response.data.message).to.equal('Webpage Scraped.');
          expect(response.data.data).to.contain('<?xml version');
          done();
        });
    });
  });
});
