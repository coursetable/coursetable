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
        avoidOptionals: true,
        namingConvention: {
          typeNames: 'change-case-all#pascalCase',
          transformUnderscore: true,
        },
        scalars: {
          float8: 'number',
          json: 'object',
          jsonb: 'object',
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
