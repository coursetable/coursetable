import crypto from 'crypto';
import jsonfile from 'jsonfile';

import { CHALLENGE_ALGORITHM, CHALLENGE_PASSWORD } from './config/constants.js';

/**
 * Encrypt a string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to encrypt
 * @prop salt - salt value to append to password
 */
export function encrypt(text, salt) {
  var cipher = crypto.createCipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt a salted string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to decrypt
 * @prop salt - salt value to append to password
 */
export function decrypt(text, salt) {
  var decipher = crypto.createDecipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt
  );
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Randomly-generate an integer between 0 and max-1
 * @prop max - max integer to return (not inclusive)
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

const JSON_FORMAT = { spaces: 4, EOL: '\n' };

/**
 * Wrapper for exporting an object to JSON.
 * @param {String} path
 * @param {Object} obj
 */
export function toJSON(path, obj) {
  jsonfile.writeFile(path, obj, JSON_FORMAT, function (err) {
    if (err) console.error(err);
  });
}
