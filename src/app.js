'use strict';

import path from 'path';
import debug from 'debug';

import morgan from 'morgan';
import log4js from 'log4js';
import mongoose from 'mongoose';
import express from 'express';
import favicon from 'serve-favicon';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import mail from './mail';
import logger from './logger';
import { connect } from './db';
import routes from './routes/index';
import news from './get/news';

debug('mapi-node:server');

var app = express();

var BASE_DIR = path.dirname(__dirname);

// view engine setup
app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Static stuff
app.use(express.static(path.join(BASE_DIR, 'public')));
//app.use(express.static(path.join(BASE_DIR, 'node_modules')));

// Logger
app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG }));

connect();
mongoose.connection.on('error', logger.error);
mongoose.connection.on('disconnected', connect);

news.init();

// Configure routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
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

process.on('SIGTERM', function () {
  logger.info("Closing nodejs application ...");
  app.close();
});

app.on('close', function () {
  logger.info("Closed nodejs application, disconnecting mongodb ...");
  mongoose.disconnect();
});

var port = normalizePort(process.env.PORT || '5000');
app.set('port', port);

app.listen(port);
debug('Listening on http://localhost:' + port);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

module.exports = app;
