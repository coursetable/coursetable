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
  courses: Array<{
    __typename?: 'courses';
    average_gut_rating: number | null;
    average_rating: number | null;
    average_rating_same_professors: number | null;
    average_professor_rating: number | null;
    average_workload: number | null;
    average_workload_same_professors: number | null;
    course_id: number;
    last_enrollment: number | null;
    last_enrollment_same_professors: boolean | null;
    evaluation_statistic: {
      __typename?: 'evaluation_statistics';
      enrolled: number;
      responses: number | null;
    } | null;
    course_meetings: Array<{
      __typename?: 'course_meetings';
      days_of_week: number;
      start_time: string;
      end_time: string;
      location: {
        __typename?: 'locations';
        room: string | null;
        building: { __typename?: 'buildings'; code: string };
      } | null;
    }>;
  }>;
};

export type CatalogBySeasonQueryVariables = Types.Exact<{
  season: Types.Scalars['String']['input'];
}>;

export type CatalogBySeasonQuery = {
  __typename?: 'query_root';
  courses: Array<{
    __typename?: 'courses';
    areas: any;
    colsem: boolean;
    course_id: number;
    credits: number | null;
    description: string | null;
    extra_info: string | null;
    final_exam: string | null;
    fysem: boolean;
    last_offered_course_id: number | null;
    primary_crn: number | null;
    requirements: string | null;
    same_course_and_profs_id: number;
    same_course_id: number;
    season_code: string;
    section: string;
    skills: any;
    sysem: boolean;
    title: string;
    time_added: any | null;
    last_updated: any | null;
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
      course_code: string;
      crn: number;
      number: string;
      school: string;
      subject: string;
    }>;
    course_meetings: Array<{
      __typename?: 'course_meetings';
      days_of_week: number;
      start_time: string;
      end_time: string;
    }>;
  }>;
};

export type CourseAttributesQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type CourseAttributesQuery = {
  __typename?: 'query_root';
  flags: Array<{ __typename?: 'flags'; flag_text: string }>;
};

export type BuildingsCatalogQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type BuildingsCatalogQuery = {
  __typename?: 'query_root';
  buildings: Array<{
    __typename?: 'buildings';
    building_name: string | null;
    code: string;
    url: string | null;
  }>;
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
    courses(where: { season_code: { _eq: $season } }) {
      average_gut_rating
      average_rating
      average_rating_same_professors
      average_professor_rating
      average_workload
      average_workload_same_professors
      course_id
      evaluation_statistic {
        enrolled
        responses
      }
      last_enrollment
      last_enrollment_same_professors
      course_meetings {
        days_of_week
        start_time
        end_time
        location {
          room
          building {
            code
          }
        }
      }
    }
  }
`;
export const CatalogBySeasonDocument = gql`
  query catalogBySeason($season: String!) {
    courses(where: { season_code: { _eq: $season } }) {
      areas
      colsem
      course_flags {
        flag {
          flag_text
        }
      }
      course_id
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
        course_code
        crn
        number
        school
        subject
      }
      primary_crn
      requirements
      same_course_and_profs_id
      same_course_id
      season_code
      section
      skills
      sysem
      course_meetings {
        days_of_week
        start_time
        end_time
      }
      title
      time_added
      last_updated
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
export const BuildingsCatalogDocument = gql`
  query buildingsCatalog {
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
    buildingsCatalog(
      variables?: BuildingsCatalogQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders,
    ): Promise<BuildingsCatalogQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<BuildingsCatalogQuery>(
            BuildingsCatalogDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders },
          ),
        'buildingsCatalog',
        'query',
        variables,
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
