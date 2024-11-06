import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [process.env.GRAPHQL_ENDPOINT!]: {
        headers: {
          'x-hasura-role': 'student',
        },
      },
    },
  ],
  documents: '**/*.graphql',
  emitLegacyCommonJSImports: false,
  generates: {
    'src/graphql-types.ts': {
      plugins: ['typescript'],
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.ts',
        baseTypesPath: 'graphql-types.ts',
      },
      plugins: ['typescript-operations', 'typescript-graphql-request'],
      config: {
        onlyOperationTypes: true,
        avoidOptionals: true,
        scalars: {
          float8: 'number',
        },
        inlineFragmentTypes: 'combine',
      },
    },
  },
};

export default config;
