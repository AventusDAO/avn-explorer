FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

# TODO copy script folder
COPY yarn.lock package.json .yarnrc.yml tsconfig.json .
COPY .yarn .yarn
COPY packages packages
COPY apps/fees apps/fees

RUN yarn install && \
    yarn build:packages && \
    yarn workspace @avn/fees run build
