## Processor template

### Start developing

1. Fill the `typegen-parachain...` files in the `typegen` directory.
2. Run the typegen `typegen-parachain` and `typegen-testnet`
1. Create `.env` file from `.env.example`
2. Add entities to the `schema.graphql` and run `make codegen` - this command will generate db entities
3. Run `docker compose up -d` to start the postgresql instance
4. Run `make migration` to create a migration
5. Run `make process` to start the processor

### Note

After every change to a `.ts` file, run `make build` to compile the typescript to javascript.
