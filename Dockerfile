FROM docker.io/node:lts-alpine

ARG version=0.3.0

ENV HOST=0.0.0.0
ENV PORT=1337

ENV APP_KEYS=w+/rpoWUMyZ7XTVPnmu5RA==,wAvgh5cC4Z8oUHuPes8YcQ==,OCF9CSm0iL9muD431HTYPw==,AfBYqqCoPMUKOrSKp4S+7w==
ENV API_TOKEN_SALT=Az9F8ga74Ng5U3cg3EUkbQ==
ENV ADMIN_JWT_SECRET= 9S+lrABG4o+rvkGLUG1d7g==

# sqlite
ENV DATABASE=sqlite
ENV DATABASE_FILENAME=.tmp/data.db

# postgres
# ENV DATABASE=postgres
# ENV DATABASE_HOST=localhost
# ENV DATABASE_PORT=5432
# ENV DATABASE_NAME=hugo-cms
# ENV DATABASE_USERNAME=cms
# ENV DATABASE_PASSWORD=
# ENV DATABASE_SSL=false

ENV EMAIL_API_KEY=SG.sendgridapikey
ENV EMAIL_DEFAULT_FROM=noreply@ez-connect.net
ENV EMAIL_DEFAULT_REPLY_TO=noreply@ez-connect.net

# Add user
RUN set -ex && adduser -D strapi

USER strapi

RUN set -ex && cd /home/strapi && \
  # Download source
  wget -O strapi-hugo.zip https://github.com/ez-connect/strapi-hugo/archive/refs/heads/v${version}.zip && \
  unzip strapi-hugo.zip && rm strapi-hugo.zip && \
  mv strapi-hugo-${version}/ app && \
  cd app && \
  # Install packages
  npm ci && \
  # Build the admin panel
  npm run build && \
  # Production environment
  NODE_ENV=production

WORKDIR /home/strapi/app/

VOLUME /home/strapi/app/.tmp
VOLUME /home/strapi/app/public

EXPOSE 1337

CMD ["npm", "start"]
