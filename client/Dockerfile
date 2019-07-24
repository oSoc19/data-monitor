FROM node:10

ARG REACT_APP_API_DOMAIN

RUN echo $REACT_APP_API_DOMAIN
WORKDIR /usr/src/app

COPY package.json ./

RUN npm install
RUN npm install -g serve

COPY . .
RUN REACT_APP_API_DOMAIN=$REACT_APP_API_DOMAIN npm run build


EXPOSE 3000

CMD ["serve", "-l", "3000", "-s", "build"]


