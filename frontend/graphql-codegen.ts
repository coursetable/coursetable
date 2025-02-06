import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'src/queries/schema-overrides.graphql',
    {
      'http://localhost:8085/v1/graphql': {
        headers: {
          'x-hasura-role': 'student',
          'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
        },
      },
    },
  ],
  config: {
    // Prefer existing field because we put our override first
    onFieldTypeConflict: (existing: unknown) => existing,
    avoidOptionals: true,
    namingConvention: {
      typeNames: 'change-case-all#pascalCase',
      transformUnderscore: true,
    },
    scalars: {
      float8: 'number',
      json: 'object',
      jsonb: 'object',
      ...Object.fromEntries(
        [
          'Season',
          'Crn',
          'ExtraInfo',
          'StringArr',
          'NumberArr',
          'ProfessorInfo',
        ].map((type) => [type, `../queries/graphql-types#${type}`]),
      ),
    },
    inlineFragmentTypes: 'combine',
  },
  generates: {
    'src/generated/graphql-types.ts': {
      documents: [
        '../api/src/catalog/catalog.queries.graphql',
        'src/queries/graphql-queries.graphql',
      ],
      plugins: ['typescript', 'typescript-operations'],
    },
    'src/queries/graphql-queries.ts': {
      preset: 'import-types',
      documents: ['src/queries/graphql-queries.graphql'],
      plugins: ['typescript-react-apollo'],
      presetConfig: {
        typesPath: '../generated/graphql-types',
      },
    },
    'src/generated/graphql.schema.json': {
      documents: ['src/queries/graphql-queries.graphql'],
      plugins: ['introspection'],
    },
  },
};
export default config;
