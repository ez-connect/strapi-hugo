FROM docker.io/alpine
# FROM docker.io/node:16.14.0-stretch-slim

ENV NODE_ENV=production

WORKDIR /app

ADD app.tar .

RUN apk add --no-cache nodejs yarn \
  # yarn insead of npm because of `sharp`
  # TODO: switch to npm
  && yarn

EXPOSE 1337

ENTRYPOINT ./node_modules/.bin/strapi start
