import { useEffect, useState } from 'react';

// Checks if object is in storage
const containsObject = (key: string, storage: Storage) => {
  return storage.getItem(key) !== null;
};
// Saves object to storage
const setObject = <T>(
  key: string,
  obj: T,
  storage: Storage,
  if_empty = false,
) => {
  if (if_empty && containsObject(key, storage)) return;
  storage.setItem(key, JSON.stringify(obj));
};
// Retrieves object from storage
const getObject = <T>(key: string, storage: Storage) => {
  const strVal = storage.getItem(key);
  if (strVal == null || strVal === 'undefined') return null;
  return JSON.parse(strVal) as T;
};
// session storage functions
export const setSSObject = <T>(key: string, obj: T, if_empty = false): void => {
  setObject<T>(key, obj, window.sessionStorage, if_empty);
};
export const getSSObject = <T>(key: string): T | null => {
  return getObject<T>(key, window.sessionStorage);
};
// local storage functions
export const setLSObject = <T>(key: string, obj: T, if_empty = false): void => {
  setObject<T>(key, obj, window.localStorage, if_empty);
};
export const getLSObject = <T>(key: string): T | null => {
  return getObject<T>(key, window.localStorage);
};
// Saves State in Session Storage
export const useSessionStorageState = <T>(
  key: string,
  default_value: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  setSSObject<T>(key, default_value, true);
  const [value, setValue] = useState<T>(getSSObject<T>(key)!);
  useEffect(() => {
    setSSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
// Saves State in Local Storage
export const useLocalStorageState = <T>(
  key: string,
  default_value: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  setLSObject<T>(key, default_value, true);
  const [value, setValue] = useState<T>(getLSObject<T>(key)!);
  useEffect(() => {
    setLSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
