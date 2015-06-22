'use strict';

import path from 'path';

import log4js from 'log4js';

import { log } from '../config';

var options = log;
if (typeof options === 'undefined') {
  options = {
    appenders: [{
      type: 'console'
    }, {
      type: 'file',
      filename: path.join(path.dirname(__dirname), 'express.log'),
      maxLogSize: 1000000,
      backups: 3,
      category: 'dev'
    }]
  };
}

log4js.configure(options);

var logger = log4js.getLogger('dev');
logger.setLevel('DEBUG');

module.exports = logger;