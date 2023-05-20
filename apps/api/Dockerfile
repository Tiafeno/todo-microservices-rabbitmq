FROM node

WORKDIR /usr/src/app

COPY package*.json ./
COPY yarn* ./

RUN yarn install

COPY . .
