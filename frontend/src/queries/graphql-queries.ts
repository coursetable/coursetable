import * as Types from '../generated/graphql-types';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {} as const;
export const RelatedCourseInfoFragmentDoc = gql`
  fragment RelatedCourseInfo on courses {
    average_professor_rating @include(if: $hasEval)
    evaluation_statistic @include(if: $hasEval) {
      avg_workload
      avg_rating
    }
    course_professors {
      professor {
        professor_id
        name
      }
    }
    course_id
    season_code
    listings {
      crn
      course_code
    }
    title
    section
    skills
    areas
    extra_info
    description
    times_by_day
    same_course_id
  }
`;
export const SameCourseOrProfOfferingsDocument = gql`
  query SameCourseOrProfOfferings(
    $seasonCode: String!
    $crn: Int!
    $same_course_id: Int!
    $professor_ids: [Int!]
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
    sameCourse: courses(where: { same_course_id: { _eq: $same_course_id } }) {
      ...RelatedCourseInfo
      syllabus_url
    }
    sameProf: course_professors(
      where: { professor_id: { _in: $professor_ids } }
    ) {
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
 *      same_course_id: // value for 'same_course_id'
 *      professor_ids: // value for 'professor_ids'
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
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.SameCourseOrProfOfferingsQuery,
    Types.SameCourseOrProfOfferingsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
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
  query SearchEvaluationNarratives($season_code: String, $crn: Int) {
    listings(
      where: { season_code: { _eq: $season_code }, crn: { _eq: $crn } }
    ) {
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
 *      season_code: // value for 'season_code'
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
  baseOptions?: Apollo.SuspenseQueryHookOptions<
    Types.SearchEvaluationNarrativesQuery,
    Types.SearchEvaluationNarrativesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
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
