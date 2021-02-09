# meetnav-frontend-base

## CICD
github webhooks and project demo

### Build

    (cd docker && docker build --build-arg GIT_WEBHOOKS_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" -t meetnav-frontend-base:demo .)

Run

    docker run -d --name demo -P -it meetnav-frontend-base:demo

Run DEV

    docker run --name demo -p 32001:8080 -p 32002:8081 -v $PWD:/github/meetnav-frontend-base  meetnav-frontend-base:demo 

## quasar
Quasar.dev app


## docker
All docker related stuff