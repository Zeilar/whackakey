FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

WORKDIR /usr/src/app/server

RUN npm i

FROM node:alpine as main

COPY --from=build /usr/src/app /

EXPOSE 3010

CMD ["node", "server/src/server.js"]
