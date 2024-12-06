import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type BuildingQueryVariables = Types.Exact<{ [key: string]: never }>;

export type BuildingQuery = {
  __typename?: 'query_root';
  buildings: Array<{
    __typename?: 'buildings';
    building_name: string | null;
    code: string;
    url: string | null;
  }>;
};

export const BuildingDocument = gql`
  query building {
    buildings {
      building_name
      code
      url
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string,
  variables?: any,
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType,
  _variables,
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper,
) {
  return {
    building(
      variables?: BuildingQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<BuildingQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<BuildingQuery>(BuildingDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'building',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
