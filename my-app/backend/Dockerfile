#FROM node:23 AS build
#WORKDIR /usr/src/app
#COPY . .
#RUN npm ci
#RUN npm run tsc

FROM node:23
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci
RUN npm run tsc
USER node
ENV NODE_ENV=production
CMD ["dumb-init", "npm", "run", "start"]



