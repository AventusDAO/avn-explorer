FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml tsconfig.json .
COPY .yarn .yarn
COPY packages packages
COPY apps/summary apps/summary

RUN yarn install && \
    yarn build:packages && \
    yarn workspace @avn/summary run build
