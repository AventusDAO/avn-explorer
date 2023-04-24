# AvN Explorer

[Balances readme](/balances/README.md)
[Archive readme](/archive//README.md)

## Setup

- Make sure you have Docker installed
- Use Node `>=18.6`
- [Install Yarn](https://yarnpkg.com/getting-started/install): `$ corepack enable && corepack prepare yarn@stable --activate`
- [Install editor config for current workspace](https://yarnpkg.com/getting-started/editor-sdks#vscode) `yarn dlx @yarnpkg/sdks vscode`
- Allow VSCode to use Workspace installed Typscript version when it asks you
- To support features like go-to-definition with Yarn v3, a plugin like ZipFS is needed. They're listed in [VSCode extension recommendation](/.vscode/extensions.json).
- Install dependencies: run `$ yarn` anywhere in the repository
- Build all apps and (their local dependencies): `$ yarn build` in the root

## Dependencies

This is a monorepo configured with Yarn v3 (but without zero-installs).

To update a dependency use `yarn up dotenv` - it will update all `dotenv` dependencies across all packages automatically. It's important to keep the installed package versions identical (especially such as `typescript`) to avoid errors when sharing the code between packages.

## Creating a new process

1. copy any processor folder and rename it
2. remove processors logic
3. define events and calls that it will work with in the `typegen` folder and generate types
4. define graph ql schema and generate models
5. add processor to the `nuke` app config
