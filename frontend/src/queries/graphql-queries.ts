import * as Types from '../generated/graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const CourseModalPrefetchCourseDataFragmentDoc = gql`
  fragment CourseModalPrefetchCourseData on courses {
    title
    skills
    areas
    extra_info
    description
    times_by_day
    same_course_id
    listings {
      crn
      course_code
    }
    course_professors {
      professor {
        professor_id
      }
    }
  }
`;
export const RelatedCourseInfoFragmentDoc = gql`
  fragment RelatedCourseInfo on courses {
    season_code
    section
    ...CourseModalPrefetchCourseData
    average_professor_rating @include(if: $hasEval)
    evaluation_statistic @include(if: $hasEval) {
      avg_workload
      avg_rating
    }
    course_professors {
      professor {
        name
      }
    }
    course_id
  }
  ${CourseModalPrefetchCourseDataFragmentDoc}
`;
export const CourseModalPrefetchListingDataFragmentDoc = gql`
  fragment CourseModalPrefetchListingData on listings {
    season_code
    crn
    course_code
    section
    course {
      ...CourseModalPrefetchCourseData
    }
  }
  ${CourseModalPrefetchCourseDataFragmentDoc}
`;
export const SameCourseOrProfOfferingsDocument = gql`
  query SameCourseOrProfOfferings(
    $seasonCode: String!
    $crn: Int!
    $sameCourseId: Int!
    $professorIds: [Int!]
    $hasEval: Boolean!
  ) {
    self: listings(
      where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }
    ) {
      course {
        description
        requirements
        syllabus_url
        course_professors {
          professor {
            professor_id
            name
            email
            courses_taught
            average_rating @include(if: $hasEval)
          }
        }
        times_by_day
        section
        course_flags {
          flag {
            flag_text
          }
        }
        evaluation_statistic @include(if: $hasEval) {
          enrolled
        }
        last_enrollment @include(if: $hasEval)
        last_enrollment_same_professors @include(if: $hasEval)
        credits
        classnotes
        regnotes
        rp_attr
        final_exam
        same_course_id
      }
      season_code
      crn
      course_code
    }
    sameCourse: courses(where: { same_course_id: { _eq: $sameCourseId } }) {
      ...RelatedCourseInfo
      syllabus_url
    }
    sameProf: course_professors(
      where: { professor_id: { _in: $professorIds } }
    ) {
      professor_id
      course {
        ...RelatedCourseInfo
      }
    }
  }
  ${RelatedCourseInfoFragmentDoc}
`;

/**
 * __useSameCourseOrProfOfferingsQuery__
 *
 * To run a query within a React component, call `useSameCourseOrProfOfferingsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSameCourseOrProfOfferingsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSameCourseOrProfOfferingsQuery({
 *   variables: {
 *      seasonCode: // value for 'seasonCode'
 *      crn: // value for 'crn'
 *      sameCourseId: // value for 'sameCourseId'
 *      professorIds: // value for 'professorIds'
 *      hasEval: // value for 'hasEval'
 *   },
 * });
 */
export function useSameCourseOrProfOfferingsQuery(
  baseOptions: Apollo.QueryHookOptions<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  > &
    (
      | {
          variables: Types.SameCourseOrProfOfferingsQueryVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export function useSameCourseOrProfOfferingsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export function useSameCourseOrProfOfferingsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        Types.SameCourseOrProfOfferingsQuery,
        Types.SameCourseOrProfOfferingsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  >(SameCourseOrProfOfferingsDocument, options);
}
export type SameCourseOrProfOfferingsQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsQuery
>;
export type SameCourseOrProfOfferingsLazyQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsLazyQuery
>;
export type SameCourseOrProfOfferingsSuspenseQueryHookResult = ReturnType<
  typeof useSameCourseOrProfOfferingsSuspenseQuery
>;
export type SameCourseOrProfOfferingsQueryResult = Apollo.QueryResult<
  Types.SameCourseOrProfOfferingsQuery,
  Types.SameCourseOrProfOfferingsQueryVariables
>;
export const SearchEvaluationNarrativesDocument = gql`
  query SearchEvaluationNarratives($seasonCode: String, $crn: Int) {
    listings(where: { season_code: { _eq: $seasonCode }, crn: { _eq: $crn } }) {
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
 *      seasonCode: // value for 'seasonCode'
 *      crn: // value for 'crn'
 *   },
 * });
 */
export function useSearchEvaluationNarrativesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >,
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
export const PrereqLinkInfoDocument = gql`
  query PrereqLinkInfo($courseCodes: [String!]) {
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
 *   },
 * });
 */
export function usePrereqLinkInfoQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.PrereqLinkInfoQuery,
    Types.PrereqLinkInfoQueryVariables
  >,
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
  query CourseSections($course_code: String, $season: String) {
    listings(
      where: {
        season_code: { _eq: $season }
        course_code: { _eq: $course_code }
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
 *      course_code: // value for 'course_code'
 *      season: // value for 'season'
 *   },
 * });
 */
export function useCourseSectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    Types.CourseSectionsQuery,
    Types.CourseSectionsQueryVariables
  >,
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
