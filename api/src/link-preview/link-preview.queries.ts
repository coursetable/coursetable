import _gql from 'graphql-tag';

// TODO: https://arethetypeswrong.github.io/?p=graphql-tag%402.12.6
const gql = _gql as unknown as typeof import('graphql-tag').default;

export const courseMetadataQuery = gql`
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
