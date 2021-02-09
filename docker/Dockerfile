FROM node AS BASE

ARG GIT_WEBHOOKS_SECRET
ENV GIT_WEBHOOKS_SECRET=$GIT_WEBHOOKS_SECRET

ENV GIT_WEBHOOKS_WEBHOOKS_PREFIX="meetnav-frontend-base"
ENV GIT_WEBHOOKS_WEBHOOKS_PORT=8081

# New patch version of npm available! 7.5.1 -> 7.5.2
RUN set -x \
    && apt-get update \
    && apt-get -yq install bash git openssh-server \
    && apt-get -yq clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && npm install -g npm@7.5.2 \
    && git --version && bash --version && ssh -V && npm -v && node -v && yarn -v && npx --version

RUN mkdir /github
WORKDIR /github

CMD ([ -d "/github/meetnav-frontend-base" ] && echo "Project already exists" || git clone https://github.com/helppery-com/meetnav-frontend-base.git) && \
    (cd /github/meetnav-frontend-base/cicd && npm install && node server.js &) && \
    (cd /github/meetnav-frontend-base/quasar && npm install && npm install --only=dev && npx quasar dev)

EXPOSE 8080 8081
