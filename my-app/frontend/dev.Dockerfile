FROM node:23
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
WORKDIR /usr/src/app
COPY . .
RUN npm install
CMD ["npm", "run", "dev", "--", "--host"]

