FROM node:lts-alpine AS base

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY ./src ./src

FROM base AS dev
RUN npm install -g nodemon

FROM base AS prod
EXPOSE 8080
CMD [ "npm", "start" ]
