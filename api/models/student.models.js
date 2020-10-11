import mysql from 'mysql';
import mysql_db from './mysql_db.js';

import { MAX_CHALLENGE_REQUESTS } from '../config/constants.js';

const Student = function(student) {};

Student.getChallengeStatus = (netid, result) => {
  mysql_db.query(
    `SELECT challengeTries,evaluationsEnabled FROM StudentBluebookSettings WHERE netid=${mysql.escape(
      netid
    )}`,
    (err, res) => {
      if (err) {
        console.error('findChallenge error: ', err);
        result(500, err, null);
        return;
      }

      // affirm single user retrieved
      if (res.length !== 1) {
        result(401, 'USER_NOT_FOUND', null);
      }

      const challengeTries = res[0]['challengeTries'];
      const evaluationsEnabled = res[0]['evaluationsEnabled'];

      if (evaluationsEnabled === 1) {
        result(403, 'ALREADY_ENABLED', null);
      }
      // limit number of challenge requests
      if (challengeTries >= MAX_CHALLENGE_REQUESTS) {
        result(429, 'MAX_TRIES_REACHED', null);
      }

      result(200, null, res[0]);

      return;
    }
  );
};

Student.incrementChallengeTries = (challengeTries, netid, result) => {
  mysql_db.query(
    `UPDATE StudentBluebookSettings SET challengeTries=${challengeTries +
      1} WHERE netid=${mysql.escape(netid)}`,
    (err, res) => {
      if (err) {
        console.error('incrementChallengeTries error: ', err);
        result(500, null);
        return;
      }

      result(200, null, true);
      return;
    }
  );
};

Student.enableEvaluations = (netid, result) => {
  mysql_db.query(
    `UPDATE StudentBluebookSettings SET evaluationsEnabled=1 WHERE netid=${mysql.escape(
      netid
    )}`,
    (err, res) => {
      if (err) {
        console.error('enableEvaluations error: ', err);
        result(500, err, null);
        return;
      }

      result(200, null, true);
      return;
    }
  );
};

export default Student;
