'use strict';

var path = require('path');
var fs = require('fs');

module.exports = {
  db: 'mongodb://localhost:27017/mapi',
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
  //optional
  smtp: {
    service: 'gmail',
    auth: {
      user: 'gmail@gmail.com',
      pass: 'somepass312'
    }
  },
  //optional
  node_https: {
    key: fs.readFileSync('./key'),
    cert: fs.readFileSync('./cert')
  }
}