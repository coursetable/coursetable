import 'posthog-node';

// Temporary fix because the official type declarations are incorrect
// TODO: remove this once posthog-node fixes their index.d.ts

// Based on https://styled-components.com/docs/api#typescript.
declare module 'posthog-node' {
  interface IdentifyMessage {
    distinctId: string;
    event?: string;
    properties?: CommonParamsInterfacePropertiesProp;
  }
}
