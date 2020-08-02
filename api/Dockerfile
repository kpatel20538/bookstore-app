FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS dev
WORKDIR /app
RUN npm i --only=development
EXPOSE 8080
CMD [ "npm", "run", "dev" ]

FROM base AS prod
WORKDIR /app
COPY ./src ./src
EXPOSE 8080
CMD [ "npm", "start" ]
