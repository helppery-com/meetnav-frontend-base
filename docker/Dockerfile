FROM node

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
RUN git clone https://github.com/helppery-com/meetnav-frontend-base.git

WORKDIR /github/meetnav-frontend-base/cicd
RUN npm install && npm install --only=dev

WORKDIR /github/meetnav-frontend-base/quasar
RUN npm install && npm install --only=dev

WORKDIR /github/meetnav-frontend-base

CMD (cd cicd && node server.js &) && \
    (cd quasar && npx quasar dev)

EXPOSE 8080 8081
