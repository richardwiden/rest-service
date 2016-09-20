
master:[![CircleCI](https://circleci.com/gh/richardwiden/rest-service/tree/master.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/richardwiden/rest-service/tree/master)
dev:[![CircleCI](https://circleci.com/gh/richardwiden/rest-service/tree/dev.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/richardwiden/rest-service/tree/dev)



This is mainly supposed to be starting point for a rest-service and either and android app or similar online webservice

* restify
* google-oath2
* mongoose

##Rest-server
A tiny ___very___ barebones webclient is included in restify-server located under "app"

http://host:port/ responds with webclient+oauth2 login

POST token to http://host:port/auth/token/google to login/create user

##Development
`cd {project-dir}` 

`docker-compose up`

* Set secret as env `AUTH_GOOGLE` from [Developer Console](https://console.developers.google.com)
* Set client id in `app/config/default.json` from [Developer Console](https://console.developers.google.com)

##Android App
Nothing so far
