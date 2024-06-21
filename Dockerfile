FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM node:alpine as main

COPY --from=build /usr/src/app /app

WORKDIR /app/dist/apps/frontend

RUN npm i -g nx

EXPOSE 3085 3086

CMD ["npm", "start", "--", "-p", "3080"]
