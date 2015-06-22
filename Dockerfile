from node:0.12.3-wheezy
MAINTAINER Eric Bower neurosnap@gmail.com

ADD . /srv
WORKDIR /srv

EXPOSE 5000

CMD ["npm", "start"]