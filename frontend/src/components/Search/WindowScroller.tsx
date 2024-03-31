// Forked from https://github.com/FedericoDiRosa/react-window-scroller

import { useRef, useEffect } from 'react';
import throttle from 'lodash.throttle';
import type { FixedSizeList } from 'react-window';

export default function WindowScroller({
  children,
}: {
  children: (props: {
    ref: React.LegacyRef<FixedSizeList>;
    outerRef?: React.RefObject<unknown>;
  }) => React.ReactNode;
  throttleTime?: number;
}) {
  const ref = useRef<FixedSizeList>(null);
  const outerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const offsetTop = outerRef.current?.offsetTop ?? 0;
      const scrollTop =
        (window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0) - offsetTop;
      ref.current?.scrollTo(scrollTop);
    }, 10);

    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      handleWindowScroll.cancel();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  return children({
    ref,
    outerRef,
  });
}
