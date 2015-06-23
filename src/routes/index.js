'use strict';

import express from 'express';

import logger from  '../logger';
import getAsync from '../lib/promise';
import { Article } from '../db';
import { sites, modules } from '../lib/constant';
import { stripHost } from '../lib/parse';

var router = express.Router();

router.get('/', news);
router.get('/:site/', news);
router.get('/:site/:section/', news);
router.get('/:site/:section/:moduleName/', news);

async function news(req, res, next) {

  let siteNames = [ for (site of sites) stripHost(site) ];

  let site = req.params.site || 'all';
  // let section = req.params.section || 'all';
  let moduleName = req.params.moduleName || 'hero';
  let mongoFilter = {};

  if (site != 'all' && siteNames.indexOf(site) == -1) {
    // unprocessable, throw correct response code
    res
      .status(422)
      .send({ error: `Invalid query argument, site '${site}' not allowed` });
  }
  else {
    if (site != 'all') {
      mongoFilter.source = site;
    }
  }

  if (modules.indexOf(moduleName) == -1) {
    // unprocessable, throw correct response code
    res
      .status(422)
      .send({ error: `Invalid query argument, module '${moduleName}' not allowed` });
  }
  else {
    mongoFilter.module = moduleName;
  }

  let news;
  console.log(mongoFilter);
  try {
    news = await Article.find(mongoFilter).sort({ created_at: -1 }).exec();
  } catch(err) {
    res.status(500).send({ error: err });
  }
  res.json(news);
}

module.exports = router;
