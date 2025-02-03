import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type CourseTimesQueryVariables = Types.Exact<{
  listingId: Types.Scalars['Int']['input'];
}>;

export type CourseTimesQuery = {
  __typename?: 'query_root';
  listings_by_pk: {
    __typename?: 'listings';
    course: {
      __typename?: 'courses';
      course_meetings: Array<{
        __typename?: 'course_meetings';
        days_of_week: number;
        start_time: string;
        end_time: string;
      }>;
    };
  } | null;
};

export const CourseTimesDocument = gql`
  query courseTimes($listingId: Int!) {
    listings_by_pk(listing_id: $listingId) {
      course {
        course_meetings {
          days_of_week
          start_time
          end_time
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
    courseTimes(
      variables: CourseTimesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CourseTimesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CourseTimesQuery>(CourseTimesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'courseTimes',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
