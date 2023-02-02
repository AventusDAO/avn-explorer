FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

COPY .yarn .yarn
COPY yarn.lock .
COPY package.json .
COPY .yarnrc.yml .
COPY tsconfig.json .
COPY packages packages
COPY apps/fees apps/fees

RUN yarn install
RUN yarn build:packages
RUN yarn workspace @avn/fees run build
