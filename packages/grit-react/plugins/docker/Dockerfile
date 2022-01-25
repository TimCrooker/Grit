FROM node:12-alpine

WORKDIR /opt/app

ENV NODE_ENV production

COPY package*.json ./

RUN npm install

EXPOSE 8080

COPY . /opt/app

CMD [ "npm", "run", "dev" ]