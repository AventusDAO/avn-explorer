# AvN Explorer

[Balances readme](/balances/README.md)
[Archive readme](/archive//README.md)

## Setup

- Make sure you have Docker installed
- Use Node `>=18.6`
- [Install Yarn](https://yarnpkg.com/getting-started/install): `$ corepack enable && corepack prepare yarn@stable --activate`
- Install dependencies: run `$ yarn` anywhere in the repository
- Allow VSCode to use Workspace installed Typscript version when it asks you

## Dependencies

This is a monorepo configured with Yarn v3 (but without zero-installs). 

To update a dependency use `yarn up dotenv` - it will update all `dotenv` dependencies across all packages automatically. It's important to keep the installed package versions identical (especially such as `typescript`) to avoid errors when sharing the code between packages.
