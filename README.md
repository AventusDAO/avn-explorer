# AvN Explorer

## Documentation

### Confluence spaces:

- [AvnExplorer](https://aventus-network-services.atlassian.net/wiki/spaces/EX/overview) (overview, architecture and links to the deployed apps)
- [Infra](https://aventus-network-services.atlassian.net/wiki/spaces/INFRA/pages/2235400199/USER+AvN+Explorer) (instructions of the deployment using ArgoCD)

### Apps:

For more developer tips refer to their READMEs:

- [archive](/apps/archive/README.md)
- account-monitor
- account-monitor-client
- [balances](/apps/balances/README.md)
- [errors](/apps/errors/README.md)
- [fees](/apps/fees/README.md)
- [nuke](/apps/nuke/README.md)
- [search](/apps/search/README.md)
- [search-server](/apps/search-server/README.md)
- [staking](/apps/staking/README.md)
- [summary](/apps/summary/README.md)
- [tokens](/apps/tokens/README.md)

## Packages:

- [avn-api](/packages/avn-api/README.md)
- [config](/packages/config/README.md)
- [metadata](/packages/metadata/README.md)
- [types](/packages/types/README.md)
- [utils](/packages/utils/README.md)

## Setup

- Make sure you have Docker installed
- Use Node `>=18.6`
- [Install Yarn](https://yarnpkg.com/getting-started/install): `$ corepack enable && corepack prepare yarn@stable --activate`
- [Install editor config for current workspace](https://yarnpkg.com/getting-started/editor-sdks#vscode) `yarn dlx @yarnpkg/sdks vscode`
- Allow VSCode to use Workspace installed Typscript version when it asks you
- To support features like go-to-definition with Yarn v3, a plugin like ZipFS is needed. They're listed in [VSCode extension recommendation](/.vscode/extensions.json).
- Install dependencies: run `$ yarn` anywhere in the repository
- Add environment variables [see chapter below](/README.md#environment-variables)
- Build all apps and (their local dependencies): `$ yarn build` in the root
- Init the database for specified environment: `make init`

## Environment Variables

Root `.env` is for the docker database:
```
DB_NAME=postgres
DB_PASS=postgres
DB_USER=postgres
DB_HOST=host.docker.internal
DB_PORT=5432
```

To configure archive `.env` refer to the [Archive README](/apps/archive/README.md)

To configure processors `.env` refer to the [Config README](/packages/config/README.md#environment-variables)

### Using different chains

To use a different chain locally without erasing the archive data change the following env vars: 
- `DB_NAME`, `AVN_NODE` in the [archive .env](/apps/archive/.env)
- `AVN_ENV` in the processor

> Note: `make init` if you're trying to run a new environment for the first time

## Dependencies

This is a monorepo configured with Yarn v3 (but without zero-installs).

To update a dependency use `yarn up dotenv` - it will update all `dotenv` dependencies across all packages automatically. It's important to keep the installed package versions identical (especially such as `typescript`) to avoid errors when sharing the code between packages.

## Creating a new processor

1. Copy any processor folder and rename it
2. Clean up processors logic
3. Define events and calls in the `typegen` folder and `make typegen-parachain-testnet` to generate types for parachain (make sure metadata are up to date)
4. Define GraphQL schema and `make codegen` to generate models
5. Add processor to the `nuke` app config

## Updating versions metadata

1. Make sure archive is fully ingested / up to date
2. `cd packages/metadata`
3. `make versions-parachain-testnet` (or for any other environment, see the [Makefile](packages/metadata/Makefile))
