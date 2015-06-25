import chance from 'chance';
import { sites, modules } from '../lib/constant';
import { stripHost } from '../lib/parse';

let Chance = chance();

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomSite() {
  return stripHost(sites[getRandomInt(0, sites.length)]);
}

function getRandomModule() {
  return modules[getRandomInt(0, modules.length)];
}

function generateArticles(opts={}, numArticles=50) {
          // caption: content.caption,
          // img_url: content.photo.crops.small_crop || undefined,
          // module: module.name,
          // section: content.taxonomy.section || undefined,
          // subsection: content.taxonomy.subsection || undefined,
          // source: site,
          // summary: content.summary,
          // title: content.headline,
          // url: content.pageurl.shortUrl || undefined

  let articles = [];
  for (let i = 0; i < numArticles; i++) {
    articles.push({
      caption: Chance.string(),
      img_url: '',
      module: getRandomModule(),
      section: Chance.string(),
      subsection: Chance.string(),
      source: getRandomSite(),
      summary: Chance.sentence(),
      title: Chance.string(),
      url: Chance.url()
    });
  }

  return articles;
}

module.exports = {
  getRandomInt,
  getRandomSite,
  getRandomModule,
  generateArticles
}