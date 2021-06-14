FROM node:12-alpine as shellprovider

RUN /bin/sh -c "apk add --no-cache bash"
RUN apk update && apk --no-cache add --virtual builds-deps build-base python


FROM node:12-alpine as builder

WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod


FROM nginx:1.19.6-alpine as webserver

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf


