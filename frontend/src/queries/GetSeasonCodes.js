import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const FETCH_SEASON_CODES = gql`
  query MyQuery {
    seasons {
      season_code
    }
  }
`;

const FetchSeasonCodes = () => {
  var { loading, error, data } = useQuery(FETCH_SEASON_CODES);

  if (!(loading || error)) {
    data = data.seasons;
  }
  return { loading, error, data };
};

export default FetchSeasonCodes;
