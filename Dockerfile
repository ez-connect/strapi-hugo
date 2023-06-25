FROM docker.io/node:lts-alpine

ARG version=0.4

ENV HOST=0.0.0.0
ENV PORT=1337

ENV APP_KEYS=w+/rpoWUMyZ7XTVPnmu5RA==,wAvgh5cC4Z8oUHuPes8YcQ==,OCF9CSm0iL9muD431HTYPw==,AfBYqqCoPMUKOrSKp4S+7w==
ENV API_TOKEN_SALT=Az9F8ga74Ng5U3cg3EUkbQ==
ENV ADMIN_JWT_SECRET=9S+lrABG4o+rvkGLUG1d7g==
ENV TRANSFER_TOKEN_SALT=tobemodified

# sqlite
# ENV DATABASE_CLIENT=sqlite
# ENV DATABASE_FILENAME=.tmp/data.db

# postgres
ENV DATABASE_CLIENT=postgres
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=5432
ENV DATABASE_NAME=cms_dev
ENV DATABASE_USERNAME=cms
ENV DATABASE_PASSWORD=
ENV DATABASE_SSL=false

ENV EMAIL_API_KEY=SG.sendgridapikey
ENV EMAIL_DEFAULT_FROM=noreply@ez-connect.net
ENV EMAIL_DEFAULT_REPLY_TO=noreply@ez-connect.net

ENV NODE_ENV=production

WORKDIR /home/strapi

COPY . .

RUN set -ex; \
	npm ci; \
	npm run build; \
	chown -R nobody:nogroup /home;

VOLUME /home/strapi/.tmp
VOLUME /home/strapi/public

EXPOSE 1337

CMD ["npm", "start"]
