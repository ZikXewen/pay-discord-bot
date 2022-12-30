FROM node:18
WORKDIR /usr/src/app

RUN apt update
RUN apt install ffmpeg

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]