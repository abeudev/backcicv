# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /app/server

# add `/app/server/node_modules/.bin` to $PATH
ENV PATH /app/server/node_modules/.bin:$PATH

RUN apk --no-cache add python make g++

# install and cache app dependencies
COPY package.json /app/server/package.json
RUN npm install

# start app
CMD ["npm", "start"]