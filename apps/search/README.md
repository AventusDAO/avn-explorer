# Search

This is a Squid based processor harvesting the search data from the archive and inserting it to ElasticSearch.

## How to run

- Make sure you have access to an Aventus chain archive
- Configure `.env` file
- Install dependencies: `yarn`
- Build project: `make build`
- Run database: `make up`
- Start processing: `make process`

## Development scripts

- Compile files in watch mode: `yarn build:watch`
- Clear DB and restart processing on each build: `yarn dev`

## Environment variables

Add `.env` file with required environment variables. Consult [config package README.md](../../packages/config/README.md). 

Note that the GraphQL variables are not needed, but you need Elastic/Open Search variables

```
ES_URL=http://localhost:9200
ES_BLOCKS_INDEX=blocks
ES_EXTRINSIC_INDEX=extrinsics
ES_EVENTS_INDEX=events
```
