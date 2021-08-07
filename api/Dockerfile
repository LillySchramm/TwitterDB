FROM node:14

WORKDIR /app

COPY package*.json .

RUN npm install

COPY src/ .

ENV MONGO_URI="<uri_here>"
ENV SITEMAP_URL="<url_here>"

EXPOSE 55536

CMD [ "node", "main.js" ]