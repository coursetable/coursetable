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
        result(err, null);
        return;
      }

      // affirm single user retrieved
      if (res.length !== 1) {
        result('USER_NOT_FOUND', null);
      }

      const challengeTries = res[0]['challengeTries'];
      const evaluationsEnabled = res[0]['evaluationsEnabled'];

      if (evaluationsEnabled === 1) {
        result('ALREADY_ENABLED');
      }
      // limit number of challenge requests
      if (challengeTries >= MAX_CHALLENGE_REQUESTS) {
        result('MAX_TRIES_REACHED');
      }

      result(null, res[0]);

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
        result(err, null);
        return;
      }

      result(null, true);
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
        result(err, null);
        return;
      }

      result(null, true);
      return;
    }
  );
};

export default Student;
