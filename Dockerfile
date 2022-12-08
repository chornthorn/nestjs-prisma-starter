# pull node 17 image for creating two stage of app
FROM node:17 AS development

#FROM alpine as development
#RUN apk add nodejs npm python3 openssl build-base

# set node environment to production
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

# set working directory
WORKDIR /usr/src/app

# copy package.json and package-lock.json
COPY package*.json ./

# RUN npm rebuild bcrypt --build-from-source
# install dependencies
RUN npm install

# copy all files
COPY . .

#build app
RUN npm run build

# build another image named production
FROM node:17 as production

# set node environment to production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# set working directory
WORKDIR /usr/src/app

# copy all files from development stage
COPY --from=development /usr/src/app .

# expose port 3000 to the outside
EXPOSE 3000

# start app
CMD ["node", "dist/main"]

# list all of commands for building and running the app
# docker build -t nestjs-docker .
# docker run -p 3000:3000 nestjs-docker

# list all of commands for building and running the app with docker-compose
# docker-compose up --build

# list all of commands for building and running the app with docker-compose in detached mode
# docker-compose up --build -d

# list all of commands for building and running the app with docker-compose in detached mode and remove containers after exit
# docker-compose up --build -d --remove-orphans

# list all of commands for building and running the app with docker-compose in detached mode and remove containers after exit and rebuild images
# docker-compose up --build -d --remove-orphans --force-recreate


# # production stage
# FROM nginx:stable-alpine AS production

# # copy build from development stage
# COPY --from=development /app/dist /usr/share/nginx/html

# # expose port 80
# EXPOSE 80

# # run nginx
# CMD ["nginx", "-g", "daemon off;"]

# build image
# docker

