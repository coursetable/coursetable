import React, {
  type MouseEventHandler,
  type ComponentProps,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Row, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import * as Sentry from '@sentry/react';

import { API_ENDPOINT } from '../config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function suspended<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
) {
  const Comp = React.lazy(async () => {
    try {
      return await factory();
    } catch {
      return {
        default: (() => (
          <div style={{ width: '100%', height: '100%' }}>
            <p style={{ fontWeight: 'bold ' }}>
              There was a problem loading this view.
            </p>
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
    <React.Suspense
      fallback={
        <Row className="m-auto" style={{ width: '100%', height: '100%' }}>
          <Spinner className="m-auto" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
      }
    >
      <Comp {...props} />
    </React.Suspense>
  );
}

// Detect clicks outside of a component
// Via https://stackoverflow.com/a/54570068/5004662
export function useComponentVisible<T extends HTMLElement>(
  initialIsVisible: boolean,
) {
  // Is the component visible?
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const elemRef = useRef<T>(null);

  // Handle clicks outside of the component
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
export function useComponentVisibleDropdown<T extends HTMLElement>(
  initialIsVisible: boolean,
  callback?: (visible: boolean) => void,
) {
  // Is the component visible?
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const toggleRef = useRef<T>(null);
  const dropdownRef = useRef<T>(null);

  // Handle clicks outside of the component
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

export async function logout() {
  try {
    const res = await fetch(`${API_ENDPOINT}/api/auth/logout`, {
      credentials: 'include',
    });
    if (!res.ok)
      throw new Error(((await res.json()) as { error?: string }).error);
    // Clear cookies
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/u, '')
        .replace(/=.*/u, `=;expires=${new Date().toUTCString()};path=/`);
    });
    // Redirect to home page and refresh as well
    window.location.pathname = '/';
  } catch (err) {
    Sentry.addBreadcrumb({
      category: 'user',
      message: 'Signing out',
      level: 'info',
    });
    Sentry.captureException(err);
    toast.error(`Failed to sign out. ${String(err)}`);
  }
}
