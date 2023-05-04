FROM node:18-alpine 

RUN apk add g++ make python3

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml tsconfig.json ./
COPY .yarn .yarn
COPY apps/nuke apps/nuke

RUN yarn install && \
    yarn workspace @avn/nuke run build
