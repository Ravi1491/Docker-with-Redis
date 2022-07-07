FROM node:14.16-alpine

RUN npm install -g nodemon
WORKDIR /src
ADD package*.json ./
RUN npm install
COPY . .

CMD ["node", "app.js"]