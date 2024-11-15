import React, {
  type MouseEventHandler,
  type ComponentProps,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { createSessionStorageSlot } from './browserStorage';
import Spinner from '../components/Spinner';
import type { Crn, Season } from '../queries/graphql-types';

const hasAutoReloaded = createSessionStorageSlot<boolean>('autoReloaded');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function suspended<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  const Comp = React.lazy(async () => {
    try {
      const result = await factory();
      // If this request succeeded, then the next failure is a new one that
      // should try autoreloading
      hasAutoReloaded.remove();
      return result;
    } catch {
      // Prevent infinite reloading: if we haven't auto reloaded, then auto
      // reload once. The next time show an error message.
      if (!hasAutoReloaded.get()) {
        hasAutoReloaded.set(true);
        window.location.reload();
        return { default: (() => null) as unknown as T };
      }
      hasAutoReloaded.remove();
      return {
        default: (() => (
          <div className="m-3">
            <p className="fw-bold">There was a problem loading this view.</p>
            <p>
              It's possible that there was an update to our code. Please{' '}
              <a href="#!" onClick={() => window.location.reload()}>
                reload the page
              </a>
              . If the error persists, you can file a{' '}
              <a target="_blank" href="/feedback">
                report
              </a>{' '}
              to let us know.
            </p>
          </div>
        )) as unknown as T,
      };
    }
  });
  return (props: ComponentProps<T>) => (
    <React.Suspense fallback={<Spinner />}>
      <Comp {...props} />
    </React.Suspense>
  );
}

// Detect clicks outside of a component
// Via https://stackoverflow.com/a/54570068/5004662
export function useComponentVisible<T extends HTMLElement>(
  initialIsVisible: boolean,
) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const elemRef = useRef<T>(null);

  const handleClickOutside = (event: Event) => {
    // Hide component if user clicked outside of it
    if (elemRef.current && !elemRef.current.contains(event.target as Node))
      setIsComponentVisible(false);
  };

  // Add event listener on mount and remove it on dismount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { elemRef, isComponentVisible, setIsComponentVisible };
}

// Detect clicks outside of a toggle and dropdown component
export function useComponentVisibleDropdown<
  T extends HTMLElement,
  U extends HTMLElement = T,
>(initialIsVisible: boolean, callback?: (visible: boolean) => void) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const toggleRef = useRef<T>(null);
  const dropdownRef = useRef<U>(null);

  const handleClickOutside = (event: Event) => {
    // Hide component if user clicked outside of it
    const portal = document.querySelector('#portal');
    if (
      toggleRef.current &&
      dropdownRef.current &&
      !toggleRef.current.contains(event.target as Node) &&
      !dropdownRef.current.contains(event.target as Node) &&
      portal &&
      !portal.contains(event.target as Node)
    ) {
      if (callback) callback(isComponentVisible);

      setIsComponentVisible(false);
    }
  };

  // Add event listener on mount and remove it on dismount
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside, true);
    return () => {
      document.body.removeEventListener('click', handleClickOutside, true);
    };
  });

  return {
    toggleRef,
    dropdownRef,
    isComponentVisible,
    setIsComponentVisible,
  };
}

export const scrollToTop: MouseEventHandler = (event) => {
  const newPage =
    event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

  if (!newPage) window.scrollTo({ top: 0, left: 0 });
};

// Please use this instead of creating a new search param. This will preserve
// existing params.
export function createCourseModalLink(
  listing: { crn: Crn; course: { season_code: Season } } | undefined,
  searchParams: URLSearchParams,
) {
  const newSearch = new URLSearchParams(searchParams);
  if (!listing) return `?${searchParams.toString()}`;
  newSearch.set('course-modal', `${listing.course.season_code}-${listing.crn}`);
  return `?${newSearch.toString()}`;
}

export function useCourseModalLink(
  listing: { crn: Crn; course: { season_code: Season } } | undefined,
) {
  const [searchParams] = useSearchParams();
  return createCourseModalLink(listing, searchParams);
}
