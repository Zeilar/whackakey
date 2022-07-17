FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM timbru31/node-alpine-git as main

COPY --from=build /usr/src/app /usr/src/app

# RUN npm i -D @swc/cli @swc/core

RUN npm i -g nx

WORKDIR /usr/src/app

CMD ["nx", "serve", "frontend", "--verbose"]



# FROM node:16 as build

# WORKDIR /usr/src/app

# COPY . .

# RUN npm i

# FROM node:alpine as main

# COPY --from=build /usr/src/app /usr/src/app

# RUN npm i -g nx

# WORKDIR /usr/src/app

# RUN nx build frontend

# WORKDIR /usr/src/app/dist/apps/frontend
# RUN npm i
# CMD ["npm", "start"]

# CMD ["nx", "serve", "frontend"]
