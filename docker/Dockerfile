FROM node

ARG GIT_WEBHOOKS_SECRET
ENV GIT_WEBHOOKS_SECRET=$GIT_WEBHOOKS_SECRET

ENV GIT_WEBHOOKS_WEBHOOKS_PREFIX="meetnav-frontend-base"
ENV GIT_WEBHOOKS_WEBHOOKS_PORT=8081

RUN set -x \
    && apt-get update \
    && apt-get -yq install bash git openssh-server \
    && apt-get -yq clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* \
    && git --version && bash --version && ssh -V && npm -v && node -v && yarn -v

RUN mkdir /github
WORKDIR /github
RUN git clone https://github.com/helppery-com/meetnav-frontend-base.git

WORKDIR /github/meetnav-frontend-base

# Webhook background
RUN node GIT_WEBHOOKS_SECRET=$GIT_WEBHOOKS_SECRET cicd/server.js &
  
WORKDIR /github/meetnav-frontend-base/quasar

RUN npm install && npm install --only=dev

CMD [ "quasar dev" ]

EXPOSE 8080 8081

