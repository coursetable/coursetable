import { useEffect, useRef, useState, useCallback } from 'react';

function safeStorageAccess<A extends (...args: never[]) => unknown>(
  action: A,
  defaultValue?: ReturnType<A>,
): A {
  return ((...args) => {
    // Access storage on the server is a huge anti-pattern. Fail early and
    // please change your code so it can't happen
    if (typeof window === 'undefined')
      throw new Error('Cannot access storage on server');
    try {
      return action(...args);
    } catch {
      // Storage access blocked. Should not be critical for us
      return defaultValue;
    }
  }) as A;
}

type StorageSlot<T> = {
  get: () => T | null;
  set: (obj: T) => void;
  remove: () => void;
  has: () => boolean;
};

function createStorageSlot<T>(storage: Storage, key: string): StorageSlot<T> {
  return {
    get: safeStorageAccess(() => {
      const strVal = storage.getItem(key);
      if (strVal === null || strVal === 'undefined') return null;
      return JSON.parse(strVal) as T;
    }, null),
    set: safeStorageAccess((obj: T) => {
      storage.setItem(key, JSON.stringify(obj));
    }),
    remove: safeStorageAccess(() => {
      storage.removeItem(key);
    }),
    has: safeStorageAccess(() => storage.getItem(key) !== null, false),
  };
}

export function createSessionStorageSlot<T>(key: string): StorageSlot<T> {
  return createStorageSlot(sessionStorage, key);
}

export function createLocalStorageSlot<T>(key: string): StorageSlot<T> {
  return createStorageSlot(localStorage, key);
}

function useStorageState<T>(
  storage: Storage,
  key: string,
  defaultValue: T | (() => T),
): readonly [T, (newValue: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const storageSlot = useRef(createStorageSlot<T>(storage, key));
  useEffect(() => {
    const ssValue = storageSlot.current.get();
    if (ssValue !== null) setValue(ssValue);
  }, []);
  const setValueAndStorage = useCallback((newValue: T) => {
    storageSlot.current.set(newValue);
    setValue(newValue);
  }, []);
  // TODO
  // eslint-disable-next-line react-compiler/react-compiler
  return [value, setValueAndStorage] as const;
}

/**
 * Syncs state with sessionStorage. Do not call setValue in SSR because there is
 * no storage to access. (i.e. only call it in useEffect or event handlers)
 * @param key **Must be a literal** — changes to the key do not cause re-renders
 * @param defaultValue Initial value for SSR and when the key is not present
 */
export const useSessionStorageState = <T>(
  key: string,
  defaultValue: T | (() => T),
): readonly [T, (newValue: T) => void] =>
  useStorageState(sessionStorage, key, defaultValue);

/**
 * Syncs state with localStorage. Do not call setValue in SSR because there is
 * no storage to access. (i.e. only call it in useEffect or event handlers)
 * @param key **Must be a literal** — changes to the key do not cause re-renders
 * @param defaultValue Initial value for SSR and when the key is not present
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T | (() => T),
): readonly [T, (newValue: T) => void] =>
  useStorageState(localStorage, key, defaultValue);
