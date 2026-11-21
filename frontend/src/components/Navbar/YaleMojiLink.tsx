import type { ComponentProps } from 'react';
import { markYaleMojiVisit } from '../../hooks/yalemojiCache';
import { useStore } from '../../store';

export default function YaleMojiLink({
  href,
  children,
  onClick,
  onAuxClick,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & { readonly href: string }) {
  const theme = useStore((state) => state.theme);
  const url = new URL(href);
  url.searchParams.set('mode', theme);
  return (
    <a
      {...props}
      href={url.toString()}
      rel="noopener noreferrer"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) markYaleMojiVisit();
      }}
      onAuxClick={(event) => {
        onAuxClick?.(event);
        if (event.button === 1 && !event.defaultPrevented) markYaleMojiVisit();
      }}
    >
      {children}
    </a>
  );
}
