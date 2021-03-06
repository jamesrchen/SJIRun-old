# SJIRun

## Attention: As of now, this repository is unmaintained

Created by https://sji.one

### Goal

This project was made for the SJI PE Department:
> Students will participate in the walk/run on their own time and pace outside of curriculum and CCA time (...) Each student is challenged to complete 169 km from [start date] to [end date]

### Important features roadmap

- [x] Leaderboard (90%)
- [ ] Gmail workspace constraints
- [ ] Start and end time
- [ ] Admin interface
- [ ] Public Api
- [ ] Tests!
  - Need to figure out how to mock MongoDB

Check out our [Trello](https://trello.com/b/3QAwZ4sK/sji-virtual-run-walk)

### Components

#### Common
docker-compose.yml allows management of both server and client. `.env.local` is used for sensitive environmental variables in development

#### Server
Handles callbacks, authentication, API Data retrieval and updating of DB. Usually hosted on api.domain.tld

#### Client
Just a web interface. Usually hosted on domain.tld

### Building for production

This project is meant to be run using docker containers and placed behind a reverse-proxy like Caddy or NGNIX to facilitate easier SSL Management (hence the lack of any ports exposed outside of linked machines)

#### Instructions:

Clone the repo onto your server

`git clone git@github.com:unknownguy2002/SJIRun.git`

Make sure to fill up .env (example in .sample-env)

`cp .sample-env .env`

To link your services to a reverse proxy (SSL Management) or to expose it straight from the container (not recommended), use a `docker-compose.override.yml`. [See more here](https://docs.docker.com/compose/extends/)

For the purposes of this project, I already have a sample override file `docker-compose.sample-override.yml`, you may want to copy this sample and configure it for your needs

Docker compose will build and handle the rest

`docker-compose up`

### Running in development mode
Create `.env.local`, similar to `.sample-env` but with `VITE_` appended to environmental variables that should be exposed to vite.js

Run `./dev.sh`, puts the client into development mode and runs nodemon