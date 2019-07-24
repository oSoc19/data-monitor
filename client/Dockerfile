FROM node:10

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm install -g serve

COPY . .
RUN npm run build


EXPOSE 3000

CMD ["serve", "-l", "3000", "-s", "build"]


