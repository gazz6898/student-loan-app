# syntax=docker/dockerfile:1

FROM node:14

ARG SVC_PATH

RUN echo ${SVC_PATH:-"no path provided... :("}

# Create app directory
WORKDIR /usr/app/backend/db-service

# Install app dependencies
COPY package*.json .
RUN npm install

# Bundle app build
COPY dist /dist

CMD [ "npm", "run", "start:dev" ]