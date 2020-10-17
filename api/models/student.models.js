import mysql from 'mysql';
import mysql_db from './mysql_db.js';

import { MAX_CHALLENGE_REQUESTS } from '../config/constants.js';

const Student = function (student) {};

/**
 * Get the challenge attempt count and whether or not
 * evaluations are enabled for a user.
 *
 * Note that an error is raised if evaluations are enabled.
 *
 * @prop netid - student's netID
 * @prop result - return object
 *
 * @return {response_code, error_message, response_data}
 */
Student.getChallengeStatus = (netid, result) => {
  mysql_db.getConnection(function (err, connection) {
    if (err) {
      console.error(err);
      result(500, err, null);
      return;
    }
    connection.query(
      `SELECT challengeTries,evaluationsEnabled FROM StudentBluebookSettings WHERE netid=${mysql.escape(
        netid
      )}`,
      (err, res) => {
        connection.release(); //put connection back in pool
        if (err) {
          console.error('findChallenge error: ', err);
          result(500, err, null);
          return;
        }

        // affirm single user retrieved
        if (res.length !== 1) {
          result(401, 'USER_NOT_FOUND', null);
          return;
        }

        const challengeTries = res[0]['challengeTries'];
        const evaluationsEnabled = res[0]['evaluationsEnabled'];

        // check if already enabled
        if (evaluationsEnabled === 1) {
          result(403, 'ALREADY_ENABLED', null);
          return;
        }
        // limit number of challenge requests
        if (challengeTries >= MAX_CHALLENGE_REQUESTS) {
          result(429, 'MAX_TRIES_REACHED', null);
          return;
        }

        result(200, null, res[0]);

        return;
      }
    );
  });
};

/**
 * Increment the number of challenge attempts for a student
 * to 1+ the provided value.
 *
 * @prop challengeTries - number of challenge attempts
 * @prop netid - student's netID
 * @prop result - return object
 *
 * @return {response_code, error_message, success_boolean}
 */
Student.incrementChallengeTries = (challengeTries, netid, result) => {
  mysql_db.getConnection(function (err, connection) {
    if (err) {
      console.error(err);
      result(500, err, null);
      return;
    }
    connection.query(
      `UPDATE StudentBluebookSettings SET challengeTries=${
        challengeTries + 1
      } WHERE netid=${mysql.escape(netid)}`,
      (err, res) => {
        connection.release(); //put connection back in pool
        if (err) {
          console.error('incrementChallengeTries error: ', err);
          result(500, err, null);
          return;
        }

        result(200, null, true);
        return;
      }
    );
  });
};

/**
 * Enable evaluations access for a user.
 *
 * @prop netid - student's netID
 * @prop result - return object
 *
 * @return {response_code, error_message, success_boolean}
 */
Student.enableEvaluations = (netid, result) => {
  mysql_db.getConnection(function (err, connection) {
    if (err) {
      console.error(err);
      result(500, err, null);
      return;
    }
    connection.query(
      `UPDATE StudentBluebookSettings SET evaluationsEnabled=1 WHERE netid=${mysql.escape(
        netid
      )}`,
      (err, res) => {
        connection.release(); //put connection back in pool
        if (err) {
          console.error('enableEvaluations error: ', err);
          result(500, err, null);
          return;
        }

        result(200, null, true);
        return;
      }
    );
  });
};

export default Student;
