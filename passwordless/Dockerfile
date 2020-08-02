FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM base AS dev
ENV NODE_ENV development
WORKDIR /app
RUN npm i --only=development
ENV NODE_ENV production 
EXPOSE 8080
CMD [ "npm", "run", "dev" ]

FROM base AS prod
ENV NODE_ENV production
WORKDIR /app
COPY ./src ./src
EXPOSE 8080
CMD [ "npm", "start" ]
