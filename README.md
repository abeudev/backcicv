# Genno Backend Starter Kit

## Requirements
- NodeJS v8 or above
- MongoDB v4
- Javascript Skill
- Basic MongoDB Skill

## Installation
- Find file index.js in  `/src/config/index.js`
- Update the  `database`  field  `username, password, dbname, url`
- Update  `server`  field to your server url
- Update  `frontEnd.baseUrl`  field
- Update  `jwt`  field as you wish
- Update  `mail`  field as your email. This will be used to send activation email for register user and forgot password. Don't forget to enable access to your email.
- Create a Database
- Run  `npm install`  inside folder  `backend-nodejs`
- Run  `npm run dev`  for dev,  `npm start`  for prod

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```


# Docker

## Build image and run Container

### Development
```
docker-compose up -d --build
```

### Stop the container
```
docker-compose stop
```

### Production
```
docker-compose -f docker-compose-prod.yml up -d --build
```

### Stop production
```
docker stop server-prod
```


# Bash Command

## Deploy Container

### Start Development Environment
```
sh ./deploy/bin/dev.sh
```

### Stop Development Environment
```
sh ./deploy/bin/stop-dev.sh
```

### Start Production Environment
```
sh ./deploy/bin/prod.sh
```

### Stop Production Environment
```
sh ./deploy/bin/stop-prod.sh
```
