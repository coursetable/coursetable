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
  if_empty = false
) => {
  if (if_empty && containsObject(key, storage)) return;
  storage.setItem(key, JSON.stringify(obj));
};
// Retrieves object from storage
const getObject = <T>(key: string, storage: Storage) => {
  const str_val = storage.getItem(key);
  if (str_val == null || str_val === 'undefined') return null;
  return JSON.parse(str_val) as T;
};
// session storage functions
export const setSSObject = <T>(key: string, obj: T, if_empty = false) => {
  setObject<T>(key, obj, window.sessionStorage, if_empty);
};
export const getSSObject = <T>(key: string) => {
  return getObject<T>(key, window.sessionStorage);
};
// local storage functions
export const setLSObject = <T>(key: string, obj: T, if_empty = false) => {
  setObject<T>(key, obj, window.localStorage, if_empty);
};
export const getLSObject = <T>(key: string) => {
  return getObject<T>(key, window.localStorage);
};
// Saves State in Session Storage
export const useSessionStorageState = <T>(key: string, default_value: T) => {
  setSSObject<T>(key, default_value, true);
  const [value, setValue] = useState<T>(getSSObject<T>(key)!);
  useEffect(() => {
    setSSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
