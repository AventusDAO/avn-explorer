FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml tsconfig.json .
COPY .yarn .yarn
COPY packages packages
COPY apps/balances apps/balances

RUN yarn install && \
    yarn build:packages && \
    yarn workspace @avn/balances run build

