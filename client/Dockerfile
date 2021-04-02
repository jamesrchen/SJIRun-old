# build stage
# Node LTS Buster Slim as vite cannot build on alpine
FROM node:lts-buster-slim as build-stage

# Get environmental variables from compose args, map exposed variables to VITE_[var name]
ARG APP_TITLE
ENV VITE_APP_TITLE $APP_TITLE

ARG CLIENT_URL
ENV VITE_CLIENT_URL $CLIENT_URL

ARG SERVER_URL
ENV VITE_SERVER_URL $SERVER_URL

ARG GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID $GOOGLE_CLIENT_ID

ARG STRAVA_CLIENT_ID
ENV VITE_STRAVA_CLIENT_ID $STRAVA_CLIENT_ID

# Copy all scripts & assets
WORKDIR /client
COPY package*.json ./
RUN npm install
COPY . .

RUN node -p process.env

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]