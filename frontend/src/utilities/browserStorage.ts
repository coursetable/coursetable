import { useEffect, useState } from 'react';

// Checks if object is in storage
const containsObject = (key: string, storage: Storage) =>
  storage.getItem(key) !== null;
// Saves object to storage
const setObject = <T>(
  key: string,
  obj: T,
  storage: Storage,
  ifEmpty = false,
) => {
  if (ifEmpty && containsObject(key, storage)) return;
  storage.setItem(key, JSON.stringify(obj));
};
// Retrieves object from storage
const getObject = <T>(key: string, storage: Storage) => {
  const strVal = storage.getItem(key);
  if (strVal === null || strVal === 'undefined') return null;
  return JSON.parse(strVal) as T;
};
const removeObject = (key: string, storage: Storage) => {
  storage.removeItem(key);
};

// TODO: refactor these to a single CRUD interface
// Session storage functions
export const setSSObject = <T>(key: string, obj: T, ifEmpty = false): void => {
  setObject<T>(key, obj, window.sessionStorage, ifEmpty);
};
export const getSSObject = <T>(key: string): T | null =>
  getObject<T>(key, window.sessionStorage);
export const removeSSObject = (key: string): void =>
  removeObject(key, window.sessionStorage);

// Local storage functions
export const setLSObject = <T>(key: string, obj: T, ifEmpty = false): void =>
  setObject<T>(key, obj, window.localStorage, ifEmpty);
export const getLSObject = <T>(key: string): T | null =>
  getObject<T>(key, window.localStorage);
export const removeLSObject = (key: string): void =>
  removeObject(key, window.localStorage);
// Saves State in Session Storage
export const useSessionStorageState = <T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  setSSObject<T>(key, defaultValue, true);
  const [value, setValue] = useState<T>(getSSObject<T>(key)!);
  useEffect(() => {
    setSSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
// Saves State in Local Storage
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  setLSObject<T>(key, defaultValue, true);
  const [value, setValue] = useState<T>(getLSObject<T>(key)!);
  useEffect(() => {
    setLSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
