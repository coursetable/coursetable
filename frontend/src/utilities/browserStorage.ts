import { useEffect, useRef, useState } from 'react';

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

export function createSessionStorageSlot<T>(key: string): StorageSlot<T> {
  return {
    get: safeStorageAccess(() => {
      const strVal = sessionStorage.getItem(key);
      if (strVal === null || strVal === 'undefined') return null;
      return JSON.parse(strVal) as T;
    }, null),
    set: safeStorageAccess((obj: T) => {
      sessionStorage.setItem(key, JSON.stringify(obj));
    }),
    remove: safeStorageAccess(() => {
      sessionStorage.removeItem(key);
    }),
    has: safeStorageAccess(() => sessionStorage.getItem(key) !== null, false),
  };
}

export function createLocalStorageSlot<T>(key: string): StorageSlot<T> {
  return {
    get: safeStorageAccess(() => {
      const strVal = localStorage.getItem(key);
      if (strVal === null || strVal === 'undefined') return null;
      return JSON.parse(strVal) as T;
    }, null),
    set: safeStorageAccess((obj: T) => {
      localStorage.setItem(key, JSON.stringify(obj));
    }),
    remove: safeStorageAccess(() => {
      localStorage.removeItem(key);
    }),
    has: safeStorageAccess(() => localStorage.getItem(key) !== null, false),
  };
}

/**
 * Syncs state with sessionStorage. Do not call setValue in SSR because there is
 * no storage to access. (i.e. only call it in useEffect or event handlers)
 * @param key **Must be a literal** — changes to the key do not cause re-renders
 * @param defaultValue Initial value for SSR and when the key is not present
 */
export const useSessionStorageState = <T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);
  const storage = useRef(createSessionStorageSlot<T>(key));
  useEffect(() => {
    const ssValue = storage.current.get();
    if (ssValue !== null) setValue(ssValue);
  }, []);
  useEffect(() => {
    storage.current.set(value);
  }, [value]);
  return [value, setValue] as const;
};
/**
 * Syncs state with localStorage. Do not call setValue in SSR because there is
 * no storage to access. (i.e. only call it in useEffect or event handlers)
 * @param key **Must be a literal** — changes to the key do not cause re-renders
 * @param defaultValue Initial value for SSR and when the key is not present
 */
export const useLocalStorageState = <T>(
  key: string,
  defaultValue: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(defaultValue);
  const storage = useRef(createSessionStorageSlot<T>(key));
  useEffect(() => {
    const lsValue = storage.current.get();
    if (lsValue !== null) setValue(lsValue);
  }, []);
  useEffect(() => {
    storage.current.set(value);
  }, [value]);
  return [value, setValue] as const;
};
