FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM node:alpine as main

COPY --from=build /usr/src/app /app

WORKDIR /app

RUN npm i -g nx

EXPOSE 3085 3086

CMD ["nx", "serve", "frontend", "--prod"]
