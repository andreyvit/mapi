#!/bin/bash

cp /etc/nginx/tmpl_nginx.conf /etc/nginx/nginx.conf
sed -i "s/%mapi-ip%/$MAPI_PORT_3000_TCP_ADDR/" /etc/nginx/nginx.conf

exec nginx
