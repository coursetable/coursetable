import graphqurl from 'graphqurl';
const { query } = graphqurl;

import { GRAPHQL_ENDPOINT } from '../config/constants.js';

import { toJSON } from '../utils.js';

import {
  listSeasonsQuery,
  catalogBySeasonQuery,
} from '../queries/catalog.queries.js';

export const refreshCatalog = (req, res, next) => {
  query({
    query: listSeasonsQuery,
    endpoint: GRAPHQL_ENDPOINT,
  })
    .then((seasons) => {
      // note that this directory is relative
      // to where the function is called
      // (i.e. /api)
      toJSON('./static/seasons.json', seasons);

      return res.json(seasons);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
