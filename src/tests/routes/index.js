import express from 'express.io';
import request from 'supertest';
import { assert } from 'chai';
import mocha from 'mocha';
import sinon from 'sinon';
import indexBy from 'lodash/collection/indexBy';
import keys from 'lodash/object/keys';

import { testDb } from '../../../config';
import { connect, disconnect, Article } from '../../db';
import createApp from '../../app';
import routes from '../../routes'
import news from '../../get/news';
import helpers from '../helpers';
import logger from '../../logger';

sinon.stub(news, 'init', async function() {
  return;
});

let app = express();
app.use('/', routes)

function verifyArticles(res, articles) {
  /**
   * Given a response from an mapi request, verify that the articles in the response
   * body match up with the articles in the articles array.
   *
   * @param {Object} [res] Express response object
   * @param {Array} [articles] Array of articles from Mongo. Will be compared to
   *  [res].body.articles
   */
  assert.property(res.body, 'articles', '\'Articles\' not found in response body');

  assert.equal(articles.length, res.body.articles.length, 'Incorrect number of articles returned');;

  if (!articles.length) return;

  console.log(articles.length);

  // Iterate over all the expected articles [articles], and make sure they're
  // all in the res.body
  let articleMap = indexBy(res.body.articles, function(obj) {
    return obj.url;
  });
  let articleProps = keys(res.body[0]);

  for (let i = 0; i < articles.length; i++) {
    let dbArticle = articles[i];
    assert.property(articleMap, dbArticle.url, 'Article URL not found');
    let resArticle = articleMap[dbArticle.url];

    // Iterate over all values in the Schema, make sure the values match
    for (let j = 0; j < articleProps.length; j++) {
      let prop = articleProps[j];

      assert.property(dbArticle, prop, 'Property doesn\'t exist in DB Schema');
      assert.equal(dbArticle[prop], resArticle[prop], `Property ${prop} does not match up`);
    }
  }
}

describe('Routes tests', function() {
  before(async function(done) {
    connect(testDb);

    logger.info('Removing all articles from mongodb ...');
    try {
      await Article.remove().exec();
    } catch (err) {
      logger.error(err);
    }

    let articles = helpers.generateArticles();

    for (let i = 0; i < articles.length; i++) {
      let articleData = articles[i];
      let article = new Article(articleData);

      try {
        await article.save()
      } catch(err) {
        logger.error(err);
      }
    }

    logger.info('Saved new batch of news articles!');

    done();
  });

  after(function() {
    disconnect();
  });

  it('Tests basic /news/ route, no filters', function(done) {

    request(app)
      .get('/news/')
      .expect('Content-Type', /json/)
      .end(async function(err, res) {
        if (err) throw err;

        let articles = await Article.find().exec();
        verifyArticles(res, articles);
        done();
      });
  });

  it('Tests /news/freep/, filtering on freep articles', function(done) {
    request(app)
      .get('/news/freep/')
      .expect('Content-Type', /json/)
      .end(async function(err, res) {
        if (err) throw err;

        let articles = await Article.find({source: 'freep'}).exec();
        verifyArticles(res, articles);
        done();
      });
  });
});
