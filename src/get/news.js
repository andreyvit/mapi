'use strict';

import logger from  '../logger';
import getAsync from '../lib/promise';
import { Article } from '../db';
import { sites, modules } from '../lib/constant';
import { stripHost } from '../lib/parse';

var default_timeout = 20 * 60 * 1000;

function init(timeout=default_timeout) {
  get_news_articles();
  setTimeout(function() { get_news_articles() }, timeout);
}

async function get_news_articles() {

  let resp;
  try {
    resp = await Promise.all([for (site of sites) getAsync(`http://${site}/sports/json`)]);
  } catch (err) {
    logger.error(err);
    return;
  }

  // Wait until we get the responses to clear the articles
  clearArticles();

  for (let i = 0; i < resp.length; i++) {
    let site = stripHost(resp[i].response.request.host);
    let data = JSON.parse(resp[i].body);

    for (let i = 0; i < data.primary_modules.length; i++) {
      let module = data.primary_modules[i];

      if (modules.indexOf(module.name) == -1) {
        //logger.warn(`Found '${module.name}' which is not in the list of modules we want, skipping ...`);
        continue;
      }

      if (!('contents' in module)) {
        logger.warn('Could not find contents list in module ${module.name}, skipping ...');
        continue;
      }

      for (let i = 0; i < module.contents.length; i++) {
        let content = module.contents[i];
        let article = new Article({
          caption: content.caption,
          img_url: content.photo.crops.small_crop || undefined,
          module: module.name,
          section: content.taxonomy.section || undefined,
          subsection: content.taxonomy.subsection || undefined,
          source: site,
          summary: content.summary,
          title: content.headline,
          url: content.pageurl.shortUrl || undefined
        });

        try {
          await article.save();
        } catch (err) {
          logger.error(err);
        }
      }
    }
  }
  logger.info('Saved new batch of news articles!');
}

async function clearArticles() {
  logger.info('Removing all articles from mongodb ...');
  try {
    await Article.remove().exec();
  } catch (err) {
    logger.error(err);
    return;
  }
}

module.exports = {
  init,
  get_news_articles
};
