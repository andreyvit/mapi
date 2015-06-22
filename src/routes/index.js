'use strict';

import express from 'express';
import moment from 'moment';

import logger from  '../logger';
import getAsync from '../lib/promise';

var router = express.Router();

var sites = {
  'detroitnews': 'detroitnews.com',
  'freep': 'freep.com',
  'battlecreekenquirer': 'battlecreekenquirer.com',
  'hometownlife': 'hometownlife.com',
  'lansingstatejournal': 'lansingstatejournal.com',
  'livingstondaily': 'livingstondaily.com',
  'thetimesherald': 'thetimesherald.com',
};

var modules = [
  'hero',
  'headline-grid',
  'featured-content',
  'sports-pulse',
];

router.get('/', news);
router.get('/:site/', news);
router.get('/:site/:section/', news);
router.get('/:site/:section/:module_name/', news);

async function news(req, res, next) {
  logger.debug(req.params);

  let response;
  try {
    response = await get_news_articles(
      req.params.site,
      req.params.section,
      req.params.module_name
    );
  } catch(err) {
    res.status(err.status).send({ error: err.message });
  }
  res.json(response);
}

async function get_news_articles(site='freep', section='sports', module_name='hero') {
  if (!(site in sites)) {
    // unprocessable, throw correct response code
    throw {
      status: 422,
      message: `Invalid query argument, site '${site}' not allowed`
    };
  }

  if (modules.indexOf(module_name) == -1) {
    // unprocessable, throw correct response code
    throw {
      status: 422,
      message: `Invalid query argument, module '${module_name}' not allowed`
    };
  }

  let url = `http://${sites[site]}/${section}/json`;

  let resp;
  try {
    resp = await getAsync(url);
  } catch(err) {
    throw {
      status: 500,
      message: err
    };
  }

  let data = JSON.parse(resp.body);

  let response = []
  for (let i = 0; i < data.primary_modules.length; i++) {
    let module = data.primary_modules[i];

    if (module.name != module_name) {
      logger.warn(`Found '${module.name}' instead of '${module_name}', skipping ...`);
      continue;
    }

    if (!('contents' in module)) {
      logger.warn('Could not find contents list in module ...');
      // resource not found, throw correct response code
      throw {
        status: 404,
        message: 'Could not find contents list in module'
      };
    }

    for (let i = 0; i < module.contents.length; i++) {
      let content = module.contents[i];
      let article = {
        source: site,
        last_updated: moment().format(),
        img_url: content.photo.crops.small_crop,
        url: content.pageurl.shortUrl,
        section: content.taxonomy.subsection,
        title: content.headline,
        summary: content.summary,
        caption: content.caption
      };
      response.push(article);
    }
  }
  return response;
}

module.exports = router;
