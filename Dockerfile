FROM node:18
WORKDIR /usr/src/app

RUN apt update
RUN apt install ffmpeg -y

COPY package*.json ./
RUN npm install
COPY . .

CMD [ "npm", "start" ]