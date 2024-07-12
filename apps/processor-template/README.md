## Processor template

### Start developing

1. Fill the `typegen-parachain...` files in the `typegen` directory.
2. Run the typegen `typegen-parachain` and `typegen-testnet`
3. Create `.env` file from `.env.example`
4. Add entities to the `schema.graphql` and run `make codegen` - this command will generate db entities
5. Run `docker compose up -d` to start the postgresql instance
6. Run `make migration` to create a migration
7. Run `make process` to start the processor

### Note

After every change to a `.ts` file, run `make build` to compile the typescript to javascript.
