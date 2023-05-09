FROM node:18

# RUN apk add g++ make python3
# EXPOSE 3000 3100

WORKDIR /app

COPY yarn.lock package.json .yarnrc.yml tsconfig.json ./
COPY .yarn .yarn
COPY packages packages
COPY apps/search-server apps/search-server

RUN yarn install && \
    yarn build:packages && \
    yarn workspace @avn/search-server run build

# HEALTHCHECK --interval=5m --timeout=10s --retries=3 --start-period=30s\
#   CMD wget --no-verbose --tries=1 --spider http://localhost:3100/status || exit 1

# CMD yarn workspace @avn/search-server run start