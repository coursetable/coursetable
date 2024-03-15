// Forked from https://github.com/FedericoDiRosa/react-window-scroller

import { useRef, useEffect } from 'react';
import throttle from 'lodash.throttle';
import { useWindowDimensions } from '../../contexts/windowDimensionsContext';

export default function WindowScroller({
  children,
  throttleTime = 10,
}: {
  children: (props: {
    ref: React.RefObject<any>;
    outerRef?: React.RefObject<any>;
    style: React.CSSProperties;
  }) => React.ReactNode;
  throttleTime?: number;
}) {
  const ref = useRef<HTMLElement>();
  const outerRef = useRef<HTMLElement>();
  const { isMobile } = useWindowDimensions();

  useEffect(() => {
    const handleWindowScroll = throttle(() => {
      const offsetTop = outerRef.current?.offsetTop ?? 0;
      const scrollTop =
        (window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0) -
        offsetTop -
        // TODO: This is a hack to account for the search form height
        (isMobile ? 400 : 0);
      ref.current?.scrollTo(scrollTop, 0);
    }, throttleTime);

    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      handleWindowScroll.cancel();
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [throttleTime, isMobile]);

  return children({
    ref,
    outerRef,
    style: {
      width: '100%',
      height: '100%',
      display: 'inline-block',
    },
  });
}
