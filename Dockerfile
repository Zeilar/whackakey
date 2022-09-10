FROM node:16 as build

WORKDIR /usr/src/app

COPY . .

RUN npm i

FROM node:alpine as main

COPY --from=build /usr/src/app /

EXPOSE 3080 3085 3086

CMD ["npm", "start"]
