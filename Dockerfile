FROM node:18-alpine
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

WORKDIR /app

# Build the project
COPY public public
COPY src src
COPY package.json .
COPY .npmrc .
RUN npm i
COPY tsconfig.json .
RUN npm run build

# Build the redirects database
COPY load-redirects.sql .
COPY redirects.csv .
RUN sqlite3 redirects.db < load-redirects.sql
RUN rm redirects.csv load-redirects.sql

EXPOSE 8000

CMD ["npm", "start"]