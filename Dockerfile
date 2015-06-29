from node:0.12.3-wheezy
MAINTAINER Eric Bower neurosnap@gmail.com

EXPOSE 3000
ENV NODE_PORT 3000
ENV NODE_ENV production

WORKDIR /srv
ADD . /srv

RUN npm install -g gulp
RUN npm install
RUN gulp

CMD ["node", "--harmony", "./dist/app"]
