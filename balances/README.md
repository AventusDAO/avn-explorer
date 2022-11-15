# Balances
 
This is a Squid based processor listing accounts and their AVT balance changes.

## How to run locally

- Make sure you have access to an Aventus chain archive
- Install dependencies: `npm i`
- Build project: `make build`
- Run database: `make up`
- Start processing: `make process`
- Serve the data over GraphQL: `make serve`
- To inspect the data via GraphQL UI go to: `http://localhost:4350/graphql`