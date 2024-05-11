import fs from 'node:fs';
import type { CodegenConfig } from '@graphql-codegen/cli';

const apisUsingGraphql = fs
  .readdirSync('src', { recursive: true })
  .map(String)
  .filter((file) => file.endsWith('.graphql'))
  .map((file) => `src/${file}`);

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GRAPHQL_ENDPOINT,
  generates: {
    ...Object.fromEntries(
      apisUsingGraphql.map((file) => [
        file.replace(/\.graphql$/u, '.ts'),
        {
          documents: [file],
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-graphql-request',
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
      ]),
    ),
  },
};
export default config;
