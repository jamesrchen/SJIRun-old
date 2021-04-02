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
Docker compose should handle most things, just make sure to fill up .env (example in .sample-env)

`docker-compose up`
