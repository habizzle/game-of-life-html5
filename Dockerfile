FROM nginx:alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY src /usr/share/nginx/html

# Replace default service url with one from the environment
RUN sed -i 's@"serverUrl": "http:\/\/localhost:8000"@"serverUrl": "'"$GAMEOFLIFE_SERVICE_URL"'"@g' /usr/share/nginx/html/defaults.json