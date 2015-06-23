'use strict';

import express from 'express';

import logger from  '../logger';
import getAsync from '../lib/promise';
import { Article } from '../db';
import { sites, modules } from '../lib/constant';

var router = express.Router();

router.get('/', news);
router.get('/:site/', news);
router.get('/:site/:section/', news);
router.get('/:site/:section/:module_name/', news);

async function news(req, res, next) {
  logger.debug(req.params);

  let site = req.params.site || 'all';
  let module_name = req.params.module_name || 'hero';

  if (site != 'all' && sites.indexOf(site) == -1) {
    // unprocessable, throw correct response code
    var err = new Error(`Invalid query argument, site '${site}' not allowed`);
    err.status = 422;
    return next(err);
  }

  if (modules.indexOf(module_name) == -1) {
    // unprocessable, throw correct response code
    var err = new Error(`Invalid query argument, module '${module_name}' not allowed`);
    err.status = 422;
    return next(err);
  }

  let news;
  try {
    news = await Article.find().sort({ created_at: -1 }).exec();
  } catch(err) {
    var err = new Error(err);
    err.status = 500;
  }
  res.json(news);
}

module.exports = router;
