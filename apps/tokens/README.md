# Balances

This is a Squid based processor listing accounts and their AVT balance changes.

## How to run

- Make sure you have access to an Aventus chain archive
- Configure `.env` file
- Install dependencies: `yarn`
- Build project: `make build`
- Run database: `make up`
- Start processing: `make process`
- Serve the data over GraphQL: `make serve`
- To inspect the data via GraphQL UI go to: `http://localhost:4350/graphql`

## Environment variables

Add `.env` file with required environment variables. Consult [config package README.md](../../packages/config/README.md).
Add `SQD_DEBUG=sqd:processor:mapping:tokens`
