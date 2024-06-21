FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM node:alpine as main

COPY --from=build /usr/src/app /app

WORKDIR /app/dist/apps/api

RUN npm i -g nx dotenv-cli

EXPOSE 3085 3086

CMD ["dotenv", "-e", "../../../apps/api/.env", "--", "node", "main.js"]
