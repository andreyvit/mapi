# Michigan API - Node

## Dependencies
* [Nodejs](http://nodejs.org) (> 0.11.2, for harmony support)
* [Grunt](http://gruntjs.com)
* [Bower](http://bower.io)
* [MongoDB](http://www.mongodb.org/)

### Optional
* [Nodemon](http://nodemon.io/)

## Install
### Node stuff
```bash
npm install -g gulp bower babel browserify
npm install
bower install
gulp
```

### [MongoDB (OSX)](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
#### [Install](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/)
```bash
brew install mongodb
```

#### [Launch](http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/#run-mongodb)
```bash
# Might need 'sudo' here
mkdir -p /data/db

# Sets up as default
# Also might need a 'sudo' here
mongod
```

#### (Optional) Launch mongodb on startup
```bash
ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgent
```

## Setup
* Create a config.js, copy the example file which is located `./config_default.js`

## Run
```bash
# Node
npm start

# iojs
npm run istart
```

#### Docker
```
docker build -t mapi/app .
docker run -d -p 5000:5000 -v /Users/dev/mapi:/srv --name mapi mapi/app
```

Opens at `http://localhost:5000`

## Credits
* Eric Bower [https://github.com/neurosnap](https://github.com/neurosnap)
* Mike Varano [https://github.com/migreva](https://github.com/migreva)