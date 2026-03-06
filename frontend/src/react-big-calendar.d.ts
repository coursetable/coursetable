import 'react-big-calendar';

// TODO: remove augmentation once @types/react-big-calendar includes showCurrentTimeIndicator
declare module 'react-big-calendar' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface CalendarProps<_TEvent = object, _TResource = object> {
    showCurrentTimeIndicator?: boolean;
  }
}
