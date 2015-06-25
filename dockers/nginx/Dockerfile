FROM nginx:1.9.2
MAINTAINER Eric Bower neurosnap@gmail.com

WORKDIR /srv

COPY nginx.conf /etc/nginx/nginx.conf
COPY run.sh /srv/run.sh

RUN chmod +x /srv/run.sh

CMD ["/srv/run.sh"]