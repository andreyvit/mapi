'use strict';

import mongoose from 'mongoose';
import { db } from '../config';

if (typeof db === 'undefined') {
  throw new Error("`db` key in config.js is required to connect to mongodb, ex: db: 'mongodb://localhost:27017/db'");
}


var Schema = mongoose.Schema;

const defaults = {
  server: {
    socketOptions: { keepAlive: 1 }
  }
};

function connect(dbString=db, options=defaults) {
  mongoose.connect(dbString, options);
}

function disconnect() {
  mongoose.disconnect();
}

var ArticleSchema = new Schema({
  caption: { type: String },
  img_url: { type: String },
  module: { type: String },
  section: { type: String },
  subsection: { type: String },
  source: { type: String, trim: true },
  summary: { type: String },
  title: { type: String },
  created_at: { type: Date, default: Date.now },
  url: { type: String }
});

module.exports = {
  Article: mongoose.model('Article', ArticleSchema),
  connect,
  disconnect
};