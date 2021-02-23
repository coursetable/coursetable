import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';
import { css } from 'styled-components';

// Detect clicks outside of a component
// Via https://stackoverflow.com/a/54570068/5004662
export const useComponentVisible = <T extends HTMLElement>(
  initialIsVisible: boolean
) => {
  // Is the component visible?
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref_visible = useRef<T>(null);

  // Handle clicks outside of the component
  const handleClickOutside = (event: Event) => {
    // Hide component if user clicked outside of it
    if (
      ref_visible.current &&
      !ref_visible.current.contains(event.target as Node)
    ) {
      setIsComponentVisible(false);
    }
  };

  // Add event listener on mount and remove it on dismount
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  });

  return { ref_visible, isComponentVisible, setIsComponentVisible };
};

// Detect clicks outside of a component
// Via https://stackoverflow.com/a/54570068/5004662
export const useComponentVisibleDropdown = <T extends HTMLElement>(
  initialIsVisible: boolean,
  callback?: (visible: boolean) => void
) => {
  // Is the component visible?
  const [isComponentVisible, setIsComponentVisible] = useState(
    initialIsVisible
  );
  const ref_toggle = useRef<T>(null);
  const ref_dropdown = useRef<T>(null);

  // Handle clicks outside of the component
  const handleClickOutside = (event: Event) => {
    // Hide component if user clicked outside of it
    if (
      ref_toggle.current &&
      ref_dropdown &&
      ref_dropdown.current &&
      !ref_toggle.current.contains(event.target as Node) &&
      !ref_dropdown.current.contains(event.target as Node)
    ) {
      if (callback) {
        callback(isComponentVisible);
      }
      setIsComponentVisible(false);
    }
  };

  // Add event listener on mount and remove it on dismount
  useEffect(() => {
    document.body.children[1].addEventListener(
      'click',
      handleClickOutside,
      true
    );
    return () => {
      document.body.children[1].removeEventListener(
        'click',
        handleClickOutside,
        true
      );
    };
  });

  return {
    ref_toggle,
    ref_dropdown,
    isComponentVisible,
    setIsComponentVisible,
  };
};

export const scrollToTop: MouseEventHandler = (event) => {
  const newPage =
    event.ctrlKey || event.shiftKey || event.altKey || event.metaKey;

  if (!newPage) {
    window.scrollTo({ top: 0, left: 0 });
  }
};

export function logout() {
  posthog.capture('logout');
  posthog.reset();

  // Clear cookies
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
  // Redirect to home page and refresh as well
  window.location.pathname = '/';
}

export const breakpoints = (
  cssProp = 'padding', // the CSS property to apply to the breakpoints
  cssPropUnits = 'px', // the units of the CSS property (can set equal to "" and apply units to values directly)
  values: { [key: number]: number }[] = [], // array of objects, e.g. [{ 800: 60 }, ...] <-- 800 (key) = screen breakpoint, 60 (value) = CSS prop breakpoint
  mediaQueryType = 'max-width' // media query breakpoint type, i.e.: max-width, min-width, max-height, min-height
) => {
  const breakpointProps = values.reduce((mediaQueries, value) => {
    const [screenBreakpoint, cssPropBreakpoint] = [
      Object.keys(value)[0],
      Object.values(value)[0],
    ];
    mediaQueries += `
    @media screen and (${mediaQueryType}: ${screenBreakpoint}px) {
      ${cssProp}: ${cssPropBreakpoint}${cssPropUnits} !important;
    }
    `;
    return mediaQueries;
  }, '');
  return css(([breakpointProps] as unknown) as TemplateStringsArray);
};
