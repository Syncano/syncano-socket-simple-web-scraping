[![CircleCI](https://circleci.com/gh/Syncano/syncano-socket-simple-web-scraping/tree/develop.svg?style=svg)](https://circleci.com/gh/Syncano/syncano-socket-simple-web-scraping/tree/develop)

# simple-web-scraper

`version:` **0.0.1**

Description of simple-web-scraper

To install, run:

```
syncano-cli add simple-web-scraper
```

## Endpoints

### scraping

Scrapes webpage and returns xpath or css selectors in xml or json format.

#### Parameters

| name | type | description | example | long_description
| ---- | ---- | ----------- | ------- | ----------------
| url | string | Webpage address to scrape from | https://funnycatsgallery.com/' | 
| selectorType | string | Indicates the type of selector to use in scraping | xpath | Contents can be scraped using either `xpath` or `css` selector. 
| extract | string | Scraped Data readable format to return. | json | Data can be returned either in `json` or `xml` format. 
| config | object | Parameter for selecting the content you want to scrape. | {   "config":     {     "title": "//*[@id='content_box']/article/header/h2/a/text()"     } }  | 



#### Response

mimetype: `application/json`

##### Success `200`

```
{
"message": "Webpage Scraped.",
"statusCode": 200,
"data": { title:[]}
}
```

##### Failed `400`

```
{
  "message": "Make sure to use GET request method for scraping webpage",
  "statusCode": 400,
  "data": {}
}
```
