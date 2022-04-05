FROM docker.io/alpine
# FROM docker.io/node:16.14.0-stretch-slim

ENV NODE_ENV=production

WORKDIR /app

# ADD app.tar .
# COPY .env .

RUN wget https://github.com/ez-connect/hugo-theme-cms/archive/refs/heads/main.zip \
  && unzip main.zip && rm main.zip \
  && mv hugo-theme-cms-main/* . \
  && rm -rf hugo-theme-cms \
  && apk add --no-cache nodejs npm \
  && npm ci \
  && npm run build

VOLUME /app/.tmp
VOLUME /app/public

EXPOSE 1337

ENTRYPOINT ./node_modules/.bin/strapi start
