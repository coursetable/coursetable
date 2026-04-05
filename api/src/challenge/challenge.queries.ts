import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type RequestEvalsQueryVariables = Types.Exact<{
  limit: Types.Scalars['Int']['input'];
  season: Types.InputMaybe<Types.Scalars['String']['input']>;
  minRating: Types.InputMaybe<Types.Scalars['float8']['input']>;
}>;

export type RequestEvalsQuery = {
  __typename?: 'query_root';
  evaluation_ratings: Array<{
    __typename?: 'evaluation_ratings';
    rating: any;
    id: number;
    course: {
      __typename?: 'courses';
      season_code: string;
      title: string;
      listings: Array<{
        __typename?: 'listings';
        crn: number;
        course_code: string;
      }>;
    };
    evaluation_question: {
      __typename?: 'evaluation_questions';
      question_text: string;
    };
  }>;
};

export type VerifyEvalsQueryVariables = Types.Exact<{
  questionIds: Types.InputMaybe<
    Array<Types.Scalars['Int']['input']> | Types.Scalars['Int']['input']
  >;
}>;

export type VerifyEvalsQuery = {
  __typename?: 'query_root';
  evaluation_ratings: Array<{
    __typename?: 'evaluation_ratings';
    id: number;
    rating: any;
  }>;
};

export const RequestEvalsDocument = gql`
  query requestEvals($limit: Int!, $season: String, $minRating: float8) {
    evaluation_ratings(
      limit: $limit
      where: {
        course: {
          season_code: { _eq: $season }
          average_rating: { _gt: $minRating }
        }
        evaluation_question: { tag: { _eq: "Overall" } }
        rating: { _is_null: false }
      }
      order_by: { course: { average_rating: asc } }
    ) {
      rating
      course {
        season_code
        title
        listings {
          crn
          course_code
        }
      }
      id
      evaluation_question {
        question_text
      }
    }
  }
`;
export const VerifyEvalsDocument = gql`
  query verifyEvals($questionIds: [Int!]) {
    evaluation_ratings(where: { id: { _in: $questionIds } }) {
      id
      rating
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
    requestEvals(
      variables: RequestEvalsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<RequestEvalsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<RequestEvalsQuery>({
            document: RequestEvalsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'requestEvals',
        'query',
        variables,
      );
    },
    verifyEvals(
      variables?: VerifyEvalsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
      signal?: RequestInit['signal'],
    ): Promise<VerifyEvalsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<VerifyEvalsQuery>({
            document: VerifyEvalsDocument,
            variables,
            requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders },
            signal,
          }),
        'verifyEvals',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
