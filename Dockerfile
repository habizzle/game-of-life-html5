FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY src /usr/share/nginx/html

ARG GAMEOFLIFE_SERVICE_URL=http://localhost:4567
ARG GAMEOFLIFE_CLIENT_URL=.

# Replace default service url with one from the environment
RUN sed -i 's@"http:\/\/localhost:4567"@"'"$GAMEOFLIFE_SERVICE_URL"'"@g' /usr/share/nginx/html/defaults.service-url.js
RUN sed -i 's@"\."@"'"$GAMEOFLIFE_CLIENT_URL"'"@g' /usr/share/nginx/html/defaults.client-url.js
