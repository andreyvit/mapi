'use strict';

import path from 'path';

import morgan from 'morgan';
import log4js from 'log4js';
import mongoose from 'mongoose';
import express from 'express.io';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import mail from './mail';
import logger from './logger';
import news from './get/news';
import { connect } from './db';
import routes from './routes/index';
import { log_level, db } from '../config';

if (typeof db === 'undefined') {
  throw new Error("`db` key in config.js is required to connect to mongodb, ex: db: 'mongodb://localhost:27017/db'");
}

var app = express();
app.http().io();

var BASE_DIR = path.dirname(__dirname);

if (app.get('env') === 'production') {
  logger.setLevel('INFO');
}

app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'public')));
app.use(log4js.connectLogger(logger));

app.use('/', routes);

connect(db);
mongoose.connection.on('error', logger.error);
mongoose.connection.on('disconnected', connect);

news.init(app);

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  logger.error(err);

  mail.mailOptions.text = `
  Status: ${err.status}
  -----
  Request: ${req.originalUrl}
  -----
  Error: ${err.message}
  -----
  Stacktrace: ${err.stack}`;

  mail.transporter.sendMail(mail.mailOptions, function(error, info) {
    if (error) logger.error(error);
    if (mail.type == 'stub') logger.info(info.response.toString());
  });

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

logger.info(`[SERVER] Environment: ${app.get('env')}`);
app.listen(port, '0.0.0.0', function() {
  let host = this.address();
  logger.info(`[SERVER] Started on ${host.address}:${host.port}`);
});

app.on('close', function() {
  logger.info("[SERVER] Closed nodejs application, disconnecting mongodb ...");
  mongoose.disconnect();
});

process.on('SIGTERM', function () {
  logger.info("[SERVER] Closing nodejs application ...");
  app.close();
});

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}
