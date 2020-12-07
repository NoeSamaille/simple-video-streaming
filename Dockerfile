FROM node

WORKDIR /app

RUN npm install

COPY . .

EXPOSE 8080

CMD npm start
