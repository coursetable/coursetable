// TODO: https://arethetypeswrong.github.io/?p=graphql-tag%402.12.6
// https://github.com/apollographql/graphql-tag/issues/804
import fs from 'node:fs';

const apiDir = new URL('../api/src', import.meta.url);

const apisUsingGraphql = fs
  .readdirSync(apiDir, { recursive: true })
  .map(String)
  .filter((file) => file.endsWith('.queries.ts'))
  .map((file) => new URL(`src/${file}`, apiDir));

for (const file of apisUsingGraphql) {
  const content = fs.readFileSync(file, 'utf-8');
  const newContent = content.replace(
    "import gql from 'graphql-tag';\n",
    "import _gql from 'graphql-tag';\n\nconst gql = _gql as unknown as typeof import('graphql-tag').default;\n",
  );
  console.log(`Fixed ${file}`);
  fs.writeFileSync(file, newContent);
}
