# pull node 16 image for creating two stage of app
FROM node:18 AS development

#FROM alpine as development
#RUN apk add nodejs npm python3 openssl build-base
RUN apt-get update && apt-get install -y openssl libssl-dev

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

# run generate prisma
RUN npm run generate

#build app
RUN npm run build

# build another image named production
FROM node:18 as production

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

