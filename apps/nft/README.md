# NFT

This is a Squid based processor processing NFTs.

## How to run

- Make sure you have access to an Aventus chain archive
- Configure `.env` file
- Install dependencies: `yarn` anywhere in the monorepo
- Build packages: `yarn build:packages` in the monorepo root
- Run database: `make up` in the monorepo root
- Build processor: `make build`
- Start processing: `make process`
- Serve the data over GraphQL: `make serve`
- To inspect the data via GraphQL UI go to: `http://localhost:${GQL_PORT}/graphql`

## Development scripts

- Compile files in watch mode: `yarn build:watch`
- Clear DB and restart processing on each build: `yarn dev`

## Environment variables

Add `.env` file with required environment variables. Consult [config package README.md](../../packages/config/README.md).
