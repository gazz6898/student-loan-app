# syntax=docker/dockerfile:1

ARG SVC_PATH="No path... :("

FROM node:14

ARG SVC_PATH
RUN echo $SVC_PATH

# Create app directory
WORKDIR /usr/app/backend/api-gateway

# Install app dependencies
COPY package*.json .
RUN npm install

# Bundle app build
COPY dist /dist

CMD [ "npm", "run", "start:dev" ]