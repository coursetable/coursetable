import * as Types from '../generated/graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const CourseModalPrefetchCourseDataFragmentDoc = gql`
  fragment CourseModalPrefetchCourseData on courses {
    season_code
    section
    title
    skills
    areas
    extra_info
    description
    same_course_id
    primary_crn
    listings {
      crn
      course_code
    }
    course_professors {
      professor {
        professor_id
      }
    }
    course_meetings {
      days_of_week
      start_time
      end_time
    }
    evaluation_statistic @include(if: $hasEvals) {
      responses
    }
  }
`;
export const CourseModalPrefetchListingDataFragmentDoc = gql`
  fragment CourseModalPrefetchListingData on listings {
    crn
    course_code
    course {
      ...CourseModalPrefetchCourseData
    }
  }
  ${CourseModalPrefetchCourseDataFragmentDoc}
`;
export const CourseModalOverviewDataDocument = gql`
  query CourseModalOverviewData(
    $seasonCode: String!
    $crn: Int!
    $sameCourseId: Int!
    $hasEvals: Boolean!
  ) {
    self: listings(
      where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }
    ) {
      course {
        description
        requirements
        syllabus_url
        course_home_url
        section
        course_professors {
          professor {
            professor_id
            name
            average_rating @include(if: $hasEvals)
          }
        }
        course_meetings {
          days_of_week
          start_time
          end_time
          location {
            room
            building {
              code
              building_name
              url
            }
          }
        }
        course_flags {
          flag {
            flag_text
          }
        }
        evaluation_statistic @include(if: $hasEvals) {
          enrolled
        }
        last_enrollment @include(if: $hasEvals)
        last_enrollment_same_professors @include(if: $hasEvals)
        credits
        classnotes
        regnotes
        rp_attr
        final_exam
        same_course_id
      }
      school
      season_code
      crn
      course_code
    }
    sameCourse: courses(where: { same_course_id: { _eq: $sameCourseId } }) {
      ...CourseModalPrefetchCourseData
      average_professor_rating @include(if: $hasEvals)
      evaluation_statistic @include(if: $hasEvals) {
        avg_workload
        avg_rating
      }
      course_professors {
        professor {
          name
          average_rating @include(if: $hasEvals)
        }
      }
      course_id
      syllabus_url
      course_home_url
    }
  }
  ${CourseModalPrefetchCourseDataFragmentDoc}
`;

/**
 * __useCourseModalOverviewDataQuery__
 *
 * To run a query within a React component, call `useCourseModalOverviewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseModalOverviewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseModalOverviewDataQuery({
 *   variables: {
 *      seasonCode: // value for 'seasonCode'
 *      crn: // value for 'crn'
 *      sameCourseId: // value for 'sameCourseId'
 *      hasEvals: // value for 'hasEvals'
 *   },
 * });
 */
export function useCourseModalOverviewDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.CourseModalOverviewDataQuery,
    Types.CourseModalOverviewDataQueryVariables
  > &
    (
      | {
          variables: Types.CourseModalOverviewDataQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CourseModalOverviewDataQuery,
    Types.CourseModalOverviewDataQueryVariables
  >(CourseModalOverviewDataDocument, options);
}
export function useCourseModalOverviewDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CourseModalOverviewDataQuery,
    Types.CourseModalOverviewDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CourseModalOverviewDataQuery,
    Types.CourseModalOverviewDataQueryVariables
  >(CourseModalOverviewDataDocument, options);
}
export function useCourseModalOverviewDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.CourseModalOverviewDataQuery,
        Types.CourseModalOverviewDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CourseModalOverviewDataQuery,
    Types.CourseModalOverviewDataQueryVariables
  >(CourseModalOverviewDataDocument, options);
}
export type CourseModalOverviewDataQueryHookResult = ReturnType<
  typeof useCourseModalOverviewDataQuery
>;
export type CourseModalOverviewDataLazyQueryHookResult = ReturnType<
  typeof useCourseModalOverviewDataLazyQuery
>;
export type CourseModalOverviewDataSuspenseQueryHookResult = ReturnType<
  typeof useCourseModalOverviewDataSuspenseQuery
>;
export type CourseModalOverviewDataQueryResult = Apollo.QueryResult<
  Types.CourseModalOverviewDataQuery,
  Types.CourseModalOverviewDataQueryVariables
>;
export const SearchEvaluationNarrativesDocument = gql`
  query SearchEvaluationNarratives($listingId: Int!) {
    listings_by_pk(listing_id: $listingId) {
      course {
        evaluation_narratives {
          comment
          evaluation_question {
            question_text
            tag
          }
        }
        evaluation_ratings {
          rating
          evaluation_question {
            question_text
            options
            tag
          }
        }
        evaluation_statistic {
          enrolled
        }
      }
    }
  }
`;

/**
 * __useSearchEvaluationNarrativesQuery__
 *
 * To run a query within a React component, call `useSearchEvaluationNarrativesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchEvaluationNarrativesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchEvaluationNarrativesQuery({
 *   variables: {
 *      listingId: // value for 'listingId'
 *   },
 * });
 */
export function useSearchEvaluationNarrativesQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  > &
    (
      | {
          variables: Types.SearchEvaluationNarrativesQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export function useSearchEvaluationNarrativesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export function useSearchEvaluationNarrativesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.SearchEvaluationNarrativesQuery,
        Types.SearchEvaluationNarrativesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >(SearchEvaluationNarrativesDocument, options);
}
export type SearchEvaluationNarrativesQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesQuery
>;
export type SearchEvaluationNarrativesLazyQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesLazyQuery
>;
export type SearchEvaluationNarrativesSuspenseQueryHookResult = ReturnType<
  typeof useSearchEvaluationNarrativesSuspenseQuery
>;
export type SearchEvaluationNarrativesQueryResult = Apollo.QueryResult<
  Types.SearchEvaluationNarrativesQuery,
  Types.SearchEvaluationNarrativesQueryVariables
>;
export const ProfModalOverviewDataDocument = gql`
  query ProfModalOverviewData($professorId: Int!, $hasEvals: Boolean!) {
    professors(where: { professor_id: { _eq: $professorId } }) {
      name
      email
      courses_taught
      average_rating @include(if: $hasEvals)
      course_professors {
        course {
          ...CourseModalPrefetchCourseData
          course_id
          evaluation_statistic @include(if: $hasEvals) {
            avg_workload
            avg_rating
          }
        }
      }
    }
  }
  ${CourseModalPrefetchCourseDataFragmentDoc}
`;

/**
 * __useProfModalOverviewDataQuery__
 *
 * To run a query within a React component, call `useProfModalOverviewDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useProfModalOverviewDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProfModalOverviewDataQuery({
 *   variables: {
 *      professorId: // value for 'professorId'
 *      hasEvals: // value for 'hasEvals'
 *   },
 * });
 */
export function useProfModalOverviewDataQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.ProfModalOverviewDataQuery,
    Types.ProfModalOverviewDataQueryVariables
  > &
    (
      | { variables: Types.ProfModalOverviewDataQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.ProfModalOverviewDataQuery,
    Types.ProfModalOverviewDataQueryVariables
  >(ProfModalOverviewDataDocument, options);
}
export function useProfModalOverviewDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.ProfModalOverviewDataQuery,
    Types.ProfModalOverviewDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.ProfModalOverviewDataQuery,
    Types.ProfModalOverviewDataQueryVariables
  >(ProfModalOverviewDataDocument, options);
}
export function useProfModalOverviewDataSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.ProfModalOverviewDataQuery,
        Types.ProfModalOverviewDataQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.ProfModalOverviewDataQuery,
    Types.ProfModalOverviewDataQueryVariables
  >(ProfModalOverviewDataDocument, options);
}
export type ProfModalOverviewDataQueryHookResult = ReturnType<
  typeof useProfModalOverviewDataQuery
>;
export type ProfModalOverviewDataLazyQueryHookResult = ReturnType<
  typeof useProfModalOverviewDataLazyQuery
>;
export type ProfModalOverviewDataSuspenseQueryHookResult = ReturnType<
  typeof useProfModalOverviewDataSuspenseQuery
>;
export type ProfModalOverviewDataQueryResult = Apollo.QueryResult<
  Types.ProfModalOverviewDataQuery,
  Types.ProfModalOverviewDataQueryVariables
>;
export const CourseModalFromUrlDocument = gql`
  query CourseModalFromURL($listingId: Int!, $hasEvals: Boolean!) {
    listings_by_pk(listing_id: $listingId) {
      ...CourseModalPrefetchListingData
    }
  }
  ${CourseModalPrefetchListingDataFragmentDoc}
`;

/**
 * __useCourseModalFromUrlQuery__
 *
 * To run a query within a React component, call `useCourseModalFromUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseModalFromUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseModalFromUrlQuery({
 *   variables: {
 *      listingId: // value for 'listingId'
 *      hasEvals: // value for 'hasEvals'
 *   },
 * });
 */
export function useCourseModalFromUrlQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.CourseModalFromUrlQuery,
    Types.CourseModalFromUrlQueryVariables
  > &
    (
      | { variables: Types.CourseModalFromUrlQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CourseModalFromUrlQuery,
    Types.CourseModalFromUrlQueryVariables
  >(CourseModalFromUrlDocument, options);
}
export function useCourseModalFromUrlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CourseModalFromUrlQuery,
    Types.CourseModalFromUrlQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CourseModalFromUrlQuery,
    Types.CourseModalFromUrlQueryVariables
  >(CourseModalFromUrlDocument, options);
}
export function useCourseModalFromUrlSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.CourseModalFromUrlQuery,
        Types.CourseModalFromUrlQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CourseModalFromUrlQuery,
    Types.CourseModalFromUrlQueryVariables
  >(CourseModalFromUrlDocument, options);
}
export type CourseModalFromUrlQueryHookResult = ReturnType<
  typeof useCourseModalFromUrlQuery
>;
export type CourseModalFromUrlLazyQueryHookResult = ReturnType<
  typeof useCourseModalFromUrlLazyQuery
>;
export type CourseModalFromUrlSuspenseQueryHookResult = ReturnType<
  typeof useCourseModalFromUrlSuspenseQuery
>;
export type CourseModalFromUrlQueryResult = Apollo.QueryResult<
  Types.CourseModalFromUrlQuery,
  Types.CourseModalFromUrlQueryVariables
>;
export const PrereqLinkInfoDocument = gql`
  query PrereqLinkInfo($courseCodes: [String!], $hasEvals: Boolean!) {
    listings(where: { course_code: { _in: $courseCodes } }) {
      ...CourseModalPrefetchListingData
    }
  }
  ${CourseModalPrefetchListingDataFragmentDoc}
`;

/**
 * __usePrereqLinkInfoQuery__
 *
 * To run a query within a React component, call `usePrereqLinkInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `usePrereqLinkInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePrereqLinkInfoQuery({
 *   variables: {
 *      courseCodes: // value for 'courseCodes'
 *      hasEvals: // value for 'hasEvals'
 *   },
 * });
 */
export function usePrereqLinkInfoQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  > &
    (
      | { variables: Types.PrereqLinkInfoQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  >(PrereqLinkInfoDocument, options);
}
export function usePrereqLinkInfoLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  >(PrereqLinkInfoDocument, options);
}
export function usePrereqLinkInfoSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.PrereqLinkInfoQuery,
        Types.PrereqLinkInfoQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  >(PrereqLinkInfoDocument, options);
}
export type PrereqLinkInfoQueryHookResult = ReturnType<
  typeof usePrereqLinkInfoQuery
>;
export type PrereqLinkInfoLazyQueryHookResult = ReturnType<
  typeof usePrereqLinkInfoLazyQuery
>;
export type PrereqLinkInfoSuspenseQueryHookResult = ReturnType<
  typeof usePrereqLinkInfoSuspenseQuery
>;
export type PrereqLinkInfoQueryResult = Apollo.QueryResult<
  Types.PrereqLinkInfoQuery,
  Types.PrereqLinkInfoQueryVariables
>;
export const CourseSectionsDocument = gql`
  query CourseSections(
    $courseCode: String!
    $seasonCode: String!
    $hasEvals: Boolean!
  ) {
    listings(
      where: {
        season_code: { _eq: $seasonCode }
        course_code: { _eq: $courseCode }
      }
    ) {
      ...CourseModalPrefetchListingData
      course {
        course_professors {
          professor {
            name
          }
        }
      }
    }
  }
  ${CourseModalPrefetchListingDataFragmentDoc}
`;

/**
 * __useCourseSectionsQuery__
 *
 * To run a query within a React component, call `useCourseSectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCourseSectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCourseSectionsQuery({
 *   variables: {
 *      courseCode: // value for 'courseCode'
 *      seasonCode: // value for 'seasonCode'
 *      hasEvals: // value for 'hasEvals'
 *   },
 * });
 */
export function useCourseSectionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  > &
    (
      | { variables: Types.CourseSectionsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  >(CourseSectionsDocument, options);
}
export function useCourseSectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  >(CourseSectionsDocument, options);
}
export function useCourseSectionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.CourseSectionsQuery,
        Types.CourseSectionsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  >(CourseSectionsDocument, options);
}
export type CourseSectionsQueryHookResult = ReturnType<
  typeof useCourseSectionsQuery
>;
export type CourseSectionsLazyQueryHookResult = ReturnType<
  typeof useCourseSectionsLazyQuery
>;
export type CourseSectionsSuspenseQueryHookResult = ReturnType<
  typeof useCourseSectionsSuspenseQuery
>;
export type CourseSectionsQueryResult = Apollo.QueryResult<
  Types.CourseSectionsQuery,
  Types.CourseSectionsQueryVariables
>;
