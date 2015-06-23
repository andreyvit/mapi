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
import { node_https } from '../config';

var app = express();
if (node_https) {
  logger.debug('[SERVER] USING HTTPS');
  app.https(node_https).io();
} else {
  logger.debug('[SERVER] USING HTTP');
  app.http().io();
}

var BASE_DIR = path.dirname(__dirname);

app.set('views', path.join(BASE_DIR, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(BASE_DIR, '/public/favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'public')));
app.use(log4js.connectLogger(logger, { level: log4js.levels.DEBUG }));

connect();
mongoose.connection.on('error', logger.error);
mongoose.connection.on('disconnected', connect);

news.init(app);

app.use('/', routes);

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

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

logger.debug(`[SERVER] Environment: ${app.get('env')}`);
app.listen(port, '0.0.0.0', function() {
  logger.debug(`[SERVER]: ${this.address().address}:${this.address().port}`);
});

process.on('SIGTERM', function () {
  logger.debug("[SERVER] Closing nodejs application ...");
  app.close();
});

app.on('close', function () {
  logger.debug("[SERVER] Closed nodejs application, disconnecting mongodb ...");
  mongoose.disconnect();
});

app.on('error', function(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

app.on('listening', function() {
  var addr = app.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  logger.debug('[SERVER] Listening on ' + bind);
});

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
