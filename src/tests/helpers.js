import Chance from 'chance';
import constants from '../lib/constant';
import parse from '../lib/parse';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomHost() {
  var numSites = constants.sites.length
  return constants.sites[getRandomInt(0, numSites)]
}

function generateArticles(opts={}, numArticles=20) {
          // caption: content.caption,
          // img_url: content.photo.crops.small_crop || undefined,
          // module: module.name,
          // section: content.taxonomy.section || undefined,
          // subsection: content.taxonomy.subsection || undefined,
          // source: site,
          // summary: content.summary,
          // title: content.headline,
          // url: content.pageurl.shortUrl || undefined


  for (var i = 0; i < numArticles; i++) {

  }

}

module.exports = {

}