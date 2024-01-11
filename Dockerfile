FROM node:16-alpine
RUN apk update && apk upgrade
RUN apk add --no-cache sqlite
# FROM node:16-slim

# Pre-reqs for building better-sqlite3.
# RUN apt-get update \
#     && apt-get install -y --no-install-recommends libexpat1-dev libnss3-dev \
#     && apt-get install -y python3 make g++

WORKDIR /app

# Install requirements
COPY package*.json .
RUN npm i

# Build the project
COPY . .
RUN npm run build

# Build the redirects database
RUN sqlite3 redirects.db < load-redirects.sql
RUN rm redirects.csv load-redirects.sql

EXPOSE 8001

CMD ["npm", "start"]