# syntax=docker/dockerfile:1

FROM node:14

# Create app directory
WORKDIR /usr/app/backend/auth-service

# Install app dependencies
COPY package*.json .
RUN npm install

# Bundle app build
COPY dist /dist

CMD [ "npm", "run", "start:dev" ]