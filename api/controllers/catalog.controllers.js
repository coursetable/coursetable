import graphqurl from 'graphqurl';
const { query } = graphqurl;

import { GRAPHQL_ENDPOINT } from '../config/constants.js';

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
      return res.json(seasons);
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      });
    });
};
