FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM timbru31/node-alpine-git as main

COPY --from=build /usr/src/app /usr/src/app

RUN npm i -g nx

WORKDIR /usr/src/app

CMD ["nx", "serve", "api", "--verbose"]
