import 'react-big-calendar';

declare module 'react-big-calendar' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface CalendarProps<_TEvent = object, _TResource = object> {
    showCurrentTimeIndicator?: boolean;
  }
}
