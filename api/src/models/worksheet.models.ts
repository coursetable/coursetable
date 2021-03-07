import mysql from 'mysql';
import { coursesDatabase } from './mysql_db.js';

import winston from "../logging/winston"

const Worksheet = function (student?: any) { };

Worksheet.add = (
  netid: string,
  crn: string,
  season: string,
  result: (statusCode: number, err: any, data: any) => void
) => {
  coursesDatabase.getConnection(function (err, connection) {
    if (err) {
      winston.error(err);
      result(500, err, null);
    }
    connection.query(
      `INSERT INTO StudentBluebookSettings (netId, oci_id, season) VALUES (${mysql.escape(
        netid
      )}, ${mysql.escape(crn)}, ${mysql.escape(season)})`,
      (err, res) => {
        connection.release(); //put connection back in pool
        if (err) {
          winston.error('Worksheet.add error: ', err);
          return;
        }

        result(200, null, res);
      }
    );
  });
};

Worksheet.remove = (
  netid: string,
  crn: string,
  season: string,
  result: (statusCode: number, err: any, data: any) => void
) => {
  coursesDatabase.getConnection(function (err, connection) {
    if (err) {
      winston.error(err);
      result(500, err, null);
    }
    connection.query(
      `DELETE FROM StudentBluebookSettings WHERE net_id = ${mysql.escape(
        netid
      )} AND oci_id = ${mysql.escape(crn)} AND season = ${mysql.escape(
        season
      )}`,
      (err, res) => {
        connection.release(); //put connection back in pool
        if (err) {
          winston.error('Worksheet.add error: ', err);
          return;
        }

        result(200, null, res);
      }
    );
  });
};
