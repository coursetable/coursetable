import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CourseMetadataQueryVariables = Types.Exact<{
  listingId: Types.Scalars['Int']['input'];
}>;

export type CourseMetadataQuery = {
  __typename?: 'query_root';
  listings_by_pk: {
    __typename?: 'listings';
    course_code: string;
    section: string;
    course: {
      __typename?: 'courses';
      title: string;
      description: string | null;
      season_code: string;
      credits: number | null;
      areas: any;
      skills: any;
      course_meetings: Array<{
        __typename?: 'course_meetings';
        days_of_week: number;
        start_time: string;
        end_time: string;
      }>;
      course_professors: Array<{
        __typename?: 'course_professors';
        professor: { __typename?: 'professors'; name: string };
      }>;
    };
  } | null;
};

export const CourseMetadataDocument = gql`
  query courseMetadata($listingId: Int!) {
    listings_by_pk(listing_id: $listingId) {
      course_code
      section
      course {
        title
        description
        season_code
        credits
        areas
        skills
        course_meetings {
          days_of_week
          start_time
          end_time
        }
        course_professors {
          professor {
            name
          }
        }
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
      signal?: RequestInit['signal'],
    ): Promise<CourseMetadataQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CourseMetadataQuery>({
            document: CourseMetadataDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'courseMetadata',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
