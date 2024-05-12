import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    'src/queries/schema-overrides.graphql',
    'http://localhost:8085/v1/graphql',
  ],
  config: {
    // Prefer existing field because we put our override first
    onFieldTypeConflict: (existing: unknown) => existing,
  },
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
          ...Object.fromEntries(
            [
              'Season',
              'Crn',
              'ExtraInfo',
              'StringArr',
              'NumberArr',
              'TimesByDay',
              'ProfessorInfo',
            ].map((type) => [type, `../queries/graphql-types#${type}`]),
          ),
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
