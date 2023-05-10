FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml tsconfig.json ./
COPY .yarn .yarn
COPY packages packages
COPY apps/search apps/search

RUN yarn install && \
    yarn build:packages && \
    yarn workspace @avn/search run build
