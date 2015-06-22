'use strict';

import express from 'express';

import logger from  '../logger';
import getAsync from '../lib/promise';
import { News, Article } from '../db';
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
    res
      .status(422)
      .send({ error: `Invalid query argument, site '${site}' not allowed` });
  }

  if (modules.indexOf(module_name) == -1) {
    // unprocessable, throw correct response code
    res
      .status(422)
      .send({ error: `Invalid query argument, module '${module_name}' not allowed` });
  }

  let news;
  try {
    news = await News.find().sort({ created_at: -1 }).limit(1).exec();
  } catch(err) {
    res.status(500).send({ error: err });
  }
  res.json(news[0]);
}

module.exports = router;
