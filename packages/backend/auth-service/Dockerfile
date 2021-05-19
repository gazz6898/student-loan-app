FROM node:14

# Create app directory
WORKDIR /usr/app

# Install app dependencies
COPY package*.json .
RUN npm install

# Bundle app build
COPY dist /dist

# If you are building your code for production
# RUN npm ci --only=production

CMD [ "npm", "start" ]