FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm test

EXPOSE 9090

CMD [ "npm", "start" ]