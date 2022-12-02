import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  generates: {
    './src/graphql/generated-balances-types.ts': {
      schema: 'http://localhost:4350/graphql',
      documents: './src/**/balances.query.graphql',
      plugins: ['typescript', 'typescript-operations', 'typed-document-node']
    },
    './src/graphql/generated-tokens-types.ts': {
      schema: 'http://localhost:4351/graphql',
      documents: './src/**/tokenBalances.query.graphql',
      plugins: ['typescript', 'typescript-operations', 'typed-document-node']
    }
  }
}
export default config
