import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8085/v1/graphql',
  generates: {
    'src/generated/graphql.ts': {
      documents: ['src/queries/queries.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        onlyOperationTypes: true,
        avoidOptionals: true,
        scalars: {
          float8: 'number',
        },
        inlineFragmentTypes: 'combine',
      },
    },
    'src/generated/graphql.schema.json': {
      documents: ['src/queries/queries.graphql'],
      plugins: ['introspection'],
    },
  },
};
export default config;
