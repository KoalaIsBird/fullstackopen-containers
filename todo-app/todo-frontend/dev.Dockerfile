FROM node:20

WORKDIR /usr/src/app

COPY . .

# Change npm ci to npm install since we are going to be in development mode
# ??? I don't get it: we install node_modules in the image but then we overwrite
# them with the volume in docker compose
RUN npm install

# this shows that this file, present in build, is overwritten by the volumes
RUN echo 'this was run in the build' > non-container-dir.txt

# npm run dev is the command to start the application in development mode
CMD ["npm", "run", "dev", "--", "--host"]
