FROM node:16-alpine
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite

WORKDIR /app

# Install requirements
COPY package*.json .
COPY .npmrc .
RUN npm i

# Build the project
COPY . .
RUN npm run build

# Don't persist the token
RUN rm -rf /app/.npmrc

# Build the redirects database
RUN sqlite3 redirects.db < load-redirects.sql
RUN rm redirects.csv load-redirects.sql

EXPOSE 8001

CMD ["npm", "start"]