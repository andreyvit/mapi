'use strict';

import mongoose from 'mongoose';

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