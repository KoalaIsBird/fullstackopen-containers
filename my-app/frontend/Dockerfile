FROM node:23 AS build
WORKDIR /usr/src/app
COPY . .
ARG VITE_BACKEND_URL
RUN npm ci
RUN npm run build

# Second stage
FROM nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html



