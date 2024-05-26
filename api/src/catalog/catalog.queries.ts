import * as Types from '../graphql-types.js';

import { GraphQLClient, RequestOptions } from 'graphql-request';
import _gql from 'graphql-tag';

const gql = _gql as unknown as typeof import('graphql-tag').default;
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type ListSeasonsQueryVariables = Types.Exact<{ [key: string]: never }>;

export type ListSeasonsQuery = {
  __typename?: 'query_root';
  seasons: Array<{ __typename?: 'seasons'; season_code: string }>;
};

export type EvalsBySeasonQueryVariables = Types.Exact<{
  season: Types.Scalars['String']['input'];
}>;

export type EvalsBySeasonQuery = {
  __typename?: 'query_root';
  listings: Array<{
    __typename?: 'listings';
    crn: number;
    course: {
      __typename?: 'courses';
      average_gut_rating: number | null;
      average_rating: number | null;
      average_rating_same_professors: number | null;
      average_professor_rating: number | null;
      average_workload: number | null;
      average_workload_same_professors: number | null;
      last_enrollment: number | null;
      last_enrollment_same_professors: boolean | null;
      evaluation_statistic: {
        __typename?: 'evaluation_statistics';
        enrolled: number | null;
      } | null;
    };
  }>;
};

export type CatalogBySeasonQueryVariables = Types.Exact<{
  season: Types.Scalars['String']['input'];
}>;

export type CatalogBySeasonQuery = {
  __typename?: 'query_root';
  listings: Array<{
    __typename?: 'listings';
    course_code: string;
    crn: number;
    listing_id: number;
    number: string;
    school: string | null;
    season_code: string;
    section: string;
    subject: string;
    course: {
      __typename?: 'courses';
      areas: any;
      classnotes: string | null;
      colsem: boolean | null;
      credits: number | null;
      description: string | null;
      extra_info: string | null;
      final_exam: string | null;
      fysem: boolean | null;
      last_offered_course_id: number | null;
      locations_summary: string | null;
      regnotes: string | null;
      requirements: string | null;
      rp_attr: string | null;
      same_course_and_profs_id: number;
      same_course_id: number;
      skills: any;
      syllabus_url: string | null;
      sysem: boolean | null;
      times_by_day: any;
      times_summary: string | null;
      title: string;
      course_flags: Array<{
        __typename?: 'course_flags';
        flag: { __typename?: 'flags'; flag_text: string };
      }>;
      course_professors: Array<{
        __typename?: 'course_professors';
        professor: {
          __typename?: 'professors';
          professor_id: number;
          name: string;
        };
      }>;
      listings: Array<{
        __typename?: 'listings';
        crn: number;
        course_code: string;
      }>;
    };
  }>;
};

export type CourseAttributesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type CourseAttributesQuery = {
  __typename?: 'query_root';
  flags: Array<{ __typename?: 'flags'; flag_text: string }>;
};

export const ListSeasonsDocument = gql`
  query listSeasons {
    seasons {
      season_code
    }
  }
`;
export const EvalsBySeasonDocument = gql`
  query evalsBySeason($season: String!) {
    listings(where: { season_code: { _eq: $season } }) {
      course {
        average_gut_rating
        average_rating
        average_rating_same_professors
        average_professor_rating
        average_workload
        average_workload_same_professors
        evaluation_statistic {
          enrolled
        }
        last_enrollment
        last_enrollment_same_professors
      }
      crn
    }
  }
`;
export const CatalogBySeasonDocument = gql`
  query catalogBySeason($season: String!) {
    listings(where: { season_code: { _eq: $season } }) {
      course {
        areas
        classnotes
        colsem
        course_flags {
          flag {
            flag_text
          }
        }
        course_professors {
          professor {
            professor_id
            name
          }
        }
        credits
        description
        extra_info
        final_exam
        fysem
        last_offered_course_id
        listings {
          crn
          course_code
        }
        locations_summary
        regnotes
        requirements
        rp_attr
        same_course_and_profs_id
        same_course_id
        skills
        syllabus_url
        sysem
        times_by_day
        times_summary
        title
      }
      course_code
      crn
      listing_id
      number
      school
      season_code
      section
      subject
    }
  }
`;
export const CourseAttributesDocument = gql`
  query courseAttributes {
    flags {
      flag_text
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
    listSeasons(
      variables?: ListSeasonsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<ListSeasonsQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<ListSeasonsQuery>(ListSeasonsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'listSeasons',
        'query',
        variables,
      );
    },
    evalsBySeason(
      variables: EvalsBySeasonQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<EvalsBySeasonQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<EvalsBySeasonQuery>(EvalsBySeasonDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'evalsBySeason',
        'query',
        variables,
      );
    },
    catalogBySeason(
      variables: CatalogBySeasonQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CatalogBySeasonQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CatalogBySeasonQuery>(
            CatalogBySeasonDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'catalogBySeason',
        'query',
        variables,
      );
    },
    courseAttributes(
      variables?: CourseAttributesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<CourseAttributesQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<CourseAttributesQuery>(
            CourseAttributesDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'courseAttributes',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
