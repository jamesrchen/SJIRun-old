# SJIRun
Created by https://sji.one

### Common
docker-compose.yml allows management of both server and client
.env.local is used for sensitive environmental variables in development

### Server
Handles callbacks, authentication, API Data retrieval and updating of DB. Usually hosted on api.domain.tld

### Client
Just a web interface. Usually hosted on domain.tld

### Building for production
Clone the repo onto your server

`git clone git@github.com:unknownguy2002/SJIRun.git`

Make sure to fill up .env (example in .sample-env)

`cp .sample-env .env`

Docker compose will build and handle the rest

`docker-compose up`

