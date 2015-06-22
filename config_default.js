'use strict';

var path = require('path');

module.exports = {
  db: 'mongodb://localhost:27017/dashbeat',
  log: {
    appenders: [{
      type: 'console'
    }, {
      type: 'file',
      filename: path.join(path.dirname(__dirname), 'express.log'),
      maxLogSize: 1000000,
      backups: 3,
      category: 'dev'
    }]
  },
  smtp: {
    service: 'gmail',
    auth: {
      user: 'gmail@gmail.com',
      pass: 'somepass312'
    }
  }
}