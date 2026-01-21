import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CrnToSameCourseIdQueryVariables = Types.Exact<{
  crns: Array<Types.Scalars['Int']['input']> | Types.Scalars['Int']['input'];
  season: Types.Scalars['String']['input'];
}>;

export type CrnToSameCourseIdQuery = {
  __typename?: 'query_root';
  listings: Array<{
    __typename?: 'listings';
    crn: number;
    course: { __typename?: 'courses'; same_course_id: number };
  }>;
};

export type AllCrnsForSameCourseIdsQueryVariables = Types.Exact<{
  sameCourseIds:
    | Array<Types.Scalars['Int']['input']>
    | Types.Scalars['Int']['input'];
  season: Types.Scalars['String']['input'];
}>;

export type AllCrnsForSameCourseIdsQuery = {
  __typename?: 'query_root';
  courses: Array<{
    __typename?: 'courses';
    same_course_id: number;
    listings: Array<{ __typename?: 'listings'; crn: number }>;
  }>;
};

export const CrnToSameCourseIdDocument = gql`
  query CrnToSameCourseId($crns: [Int!]!, $season: String!) {
    listings(
      where: { crn: { _in: $crns }, course: { season_code: { _eq: $season } } }
    ) {
      crn
      course {
        same_course_id
      }
    }
  }
`;
export const AllCrnsForSameCourseIdsDocument = gql`
  query AllCrnsForSameCourseIds($sameCourseIds: [Int!]!, $season: String!) {
    courses(
      where: {
        same_course_id: { _in: $sameCourseIds }
        season_code: { _eq: $season }
      }
    ) {
      same_course_id
      listings {
        crn
      }
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
    CrnToSameCourseId(
      variables: CrnToSameCourseIdQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CrnToSameCourseIdQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CrnToSameCourseIdQuery>(
            CrnToSameCourseIdDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'CrnToSameCourseId',
        'query',
        variables,
      );
    },
    AllCrnsForSameCourseIds(
      variables: AllCrnsForSameCourseIdsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<AllCrnsForSameCourseIdsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<AllCrnsForSameCourseIdsQuery>(
            AllCrnsForSameCourseIdsDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'AllCrnsForSameCourseIds',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
