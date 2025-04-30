FROM node:lts
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends dumb-init

WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --only=production

USER node
CMD ["dumb-init", "node", "./bin/www"]



