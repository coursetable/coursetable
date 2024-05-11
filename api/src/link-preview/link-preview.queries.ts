import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CourseMetadataQueryVariables = Types.Exact<{
  seasonCode: Types.Scalars['String']['input'];
  crn: Types.Scalars['Int']['input'];
}>;

export type CourseMetadataQuery = {
  __typename?: 'query_root';
  listings: Array<{
    __typename?: 'listings';
    course_code: string;
    section: string;
    course: {
      __typename?: 'courses';
      title: string;
      description: string | null;
    };
  }>;
};

export const CourseMetadataDocument = gql`
  query courseMetadata($seasonCode: String!, $crn: Int!) {
    listings(where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }) {
      course_code
      section
      course {
        title
        description
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
    courseMetadata(
      variables: CourseMetadataQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CourseMetadataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CourseMetadataQuery>(
            CourseMetadataDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'courseMetadata',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
