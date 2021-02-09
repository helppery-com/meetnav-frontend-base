# meetnav-frontend-base
Quasar APP frontend for meetnav

[![gitter](https://icon-icons.com/icons2/2530/PNG/64/gitter_button_icon_151850.png)](https://gitter.im/meetnav/community) Let's talk

This project is a test for a distributed development of an open sourced project based on [gig economy](https://www.investopedia.com/terms/g/gig-economy.asp)

> Only issues tagged as `help-wanted` will be paid.
## How to apply for a `help-wanted` issue
If you want to apply for `help-wanted` issues:
 * Post a comment with a reference to your work on any freelancer paltform, linkedin, ...
 * We'll contact you and agree on the price
 * Clone repository and submit pull request to get paid

Collaborators will have preference when assigning `help-wanted` issues, will be offer you to become a collaborator based on the quality of your work and reliability.

## Colaborators
They are the preferred developers for the project.
Have access to repository and will be able to review/validate Pull Request as well.
They will get paid for developments and repository maintenance.
## Development requirements
 * Visual Studio Code
 * Docker

## How this project work
Simple way to collaborate with this project is:
 * Build image (see CICD `Build`)
 * From your dev resposiroty execute the DEV container (see CICD: `Run DEV`)
 * Pick a issue and create a pull request
 * If is a paid issue you must first agree the price in the follwing platforms:
   * Freelancer
   * Fiverr
   * Or comment if you work with any other

# Project structure  
## CICD
github webhooks and project demo

### Build
Build the image for the github webhooks and app
    (docker build \
      --build-arg GIT_WEBHOOKS_SECRET="SECRET_HERE" \
      -t meetnav-frontend-base:demo \
      https://github.com/helppery-com/meetnav-frontend-base.git#main:docker)
Run

    docker run -d --name demo -p $APP_PORT:8080 -p $CICD_PORT:8081 -it meetnav-frontend-base:demo

Run DEV

    docker run --name demo -p $APP_PORT:8080 -p $CICD_PORT:8081 -v $PWD:/github/meetnav-frontend-base  meetnav-frontend-base:demo 

## quasar
Quasar.dev app

## docker
All docker related stuff