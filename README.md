# meetnav-frontend-base

## CICD
github webhooks and project demo

### Build
Remote build to run demo project and update with changes
    docker build --build-arg GIT_WEBHOOKS_SECRET="SECRET_HERE" --target BASE -t meetnav-frontend-base:demo .

Development
    docker build --build-arg GIT_WEBHOOKS_SECRET="SECRET_HERE" --target DEV -t meetnav-frontend-base:demo .

Run
    docker run -d --name demo -P -it meetnav-frontend-base:demo
or
    docker run -d --name demo -p $PORT_APP:8080 -p $PORT_WEBHOOKS:8081 -it meetnav-frontend-base:demo

## quasar
Quasar.dev app


## docker
All docker related stuff