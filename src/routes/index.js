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
  let moduleName = req.params.moduleName || 'all';
  let mongoFilter = {};

  if (site != 'all' && siteNames.indexOf(site) == -1) {
    // unprocessable, throw correct response code
    var err = new Error(`Invalid query argument, site '${site}' not allowed`);
    err.status = 422;
    return next(err);
  }
  else if (site != 'all') {
      mongoFilter.source = site;
  }

  if (moduleName != 'all' && modules.indexOf(moduleName) == -1) {
    // unprocessable, throw correct response code
    var err = new Error(`Invalid query argument, module '${module_name}' not allowed`);
    err.status = 422;
    return next(err);
  }
  else if (moduleName != 'all') {
    mongoFilter.module = moduleName;
  }

  let news;
  try {
    news = await Article.find(mongoFilter).sort({ created_at: -1 }).exec();
  } catch(err) {
    var err = new Error(err);
    err.status = 500;
  }
  res.json(news);
}

module.exports = router;
