FROM docker.io/alpine

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
# ENV DATABASE_USERNAME=root
# ENV DATABASE_USERNAME=root
# ENV DATABASE_PASSWORD=
# ENV DATABASE_SSL=false

ENV EMAIL_API_KEY=SG.sendgridapikey
ENV EMAIL_DEFAULT_FROM=noreply@ez-connect.net
ENV EMAIL_DEFAULT_REPLY_TO=noreply@ez-connect.net

WORKDIR /app

RUN set -e -x && \
  # NodeJS
  apk add --no-cache nodejs npm && \
  # Download source
  wget https://github.com/ez-connect/hugo-theme-cms/archive/refs/heads/main.zip && \
  unzip main.zip && rm main.zip && \
  mv hugo-theme-cms-main/* . && \
  rm -rf hugo-theme-cms && \
  # Install packages
  npm ci && \
  # Build the admin panel
  npm run build && \
  # Production environment
  NODE_ENV=production

VOLUME /app/.tmp
VOLUME /app/public

EXPOSE 1337

CMD ["npm", "start"]
