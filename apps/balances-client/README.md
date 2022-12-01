## Balances processor client

### Requirements

it requires `ts-node` to be installed as top-level dependency

### Prerequisites:

1. built and initialized balances squid service [Balances readme](/balances/README.md)
2. initiated graphql server

### Steps to run:

1. `yarn install`
2. create and populate `.env` file with `VITE_API_URL=http://localhost:4350/graphql` or whatever the graphql server url is depending on the environment
3. For development environment initialization run `yarn dev`
4. For building prod version run `yarn build` and `yarn preview`