import crypto from 'crypto';

import { CHALLENGE_ALGORITHM, CHALLENGE_PASSWORD } from '../config';

/**
 * Encrypt a string according to CHALLENGE_ALGORITHM and CHALLENGE_PASSWORD.
 * @prop text - string to encrypt
 * @prop salt - salt value to append to password
 */
export function encrypt(text: string, salt: string): string {
  // TODO
  // eslint-disable-next-line n/no-deprecated-api
  const cipher = crypto.createCipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt,
  );
  let crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

/**
 * Decrypt a salted string according to CHALLENGE_ALGORITHM and
 * CHALLENGE_PASSWORD.
 * @prop text - string to decrypt
 * @prop salt - salt value to append to password
 */
export function decrypt(text: string, salt: string): string {
  // TODO
  // eslint-disable-next-line n/no-deprecated-api
  const decipher = crypto.createDecipher(
    CHALLENGE_ALGORITHM,
    CHALLENGE_PASSWORD + salt,
  );
  let dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}

/**
 * Randomly-generate an integer between 0 and max-1
 * @prop max - max integer to return (not inclusive)
 */
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * Math.floor(max));
}
