import { useEffect, useState } from 'react';

// Checks if object is in storage
const containsObject = (key: string, storage: Storage) => {
  try {
    return storage.getItem(key) !== null;
  } catch {
    // Storage access blocked. Should not be critical for us
    return false;
  }
};
// Saves object to storage
const setObject = <T>(
  key: string,
  obj: T,
  storage: Storage,
  ifEmpty = false,
) => {
  if (ifEmpty && containsObject(key, storage)) return;
  try {
    storage.setItem(key, JSON.stringify(obj));
  } catch {
    // Storage access blocked. Should not be critical for us
  }
};
// Retrieves object from storage
const getObject = <T>(key: string, storage: Storage) => {
  try {
    const strVal = storage.getItem(key);
    if (strVal === null || strVal === 'undefined') return null;
    return JSON.parse(strVal) as T;
  } catch {
    // Storage access blocked. Should not be critical for us
    return null;
  }
};
const removeObject = (key: string, storage: Storage) => {
  storage.removeItem(key);
};

// TODO: refactor these to a single CRUD interface
// Session storage functions
const setSSObject = <T>(key: string, obj: T, ifEmpty = false): void => {
  setObject<T>(key, obj, window.sessionStorage, ifEmpty);
};
const getSSObject = <T>(key: string): T | null =>
  getObject<T>(key, window.sessionStorage);
export const removeSSObject = (key: string): void =>
  removeObject(key, window.sessionStorage);

// Local storage functions
const setLSObject = <T>(key: string, obj: T, ifEmpty = false): void =>
  setObject<T>(key, obj, window.localStorage, ifEmpty);
const getLSObject = <T>(key: string): T | null =>
  getObject<T>(key, window.localStorage);
export const removeLSObject = (key: string): void =>
  removeObject(key, window.localStorage);
// Saves State in Session Storage
export const useSessionStorageState = <T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    const ssValue = getSSObject<T>(key);
    if (ssValue !== null) setValue(ssValue);
  }, [key]);
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
  const [value, setValue] = useState<T>(defaultValue);
  useEffect(() => {
    const lsValue = getLSObject<T>(key);
    if (lsValue !== null) setValue(lsValue);
  }, [key]);
  useEffect(() => {
    setLSObject(key, value);
  }, [key, value]);
  return [value, setValue] as const;
};
