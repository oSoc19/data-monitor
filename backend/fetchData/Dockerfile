FROM node:10

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install supervisor -g
RUN npm install

COPY . .

CMD ["node","index.js"]
