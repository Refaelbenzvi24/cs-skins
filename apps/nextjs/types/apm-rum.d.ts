declare module '@elastic/apm-rum-react' {
  import type { ComponentType } from 'react';
  import type { Route } from 'react-router';
  export const ApmRoute: typeof Route;

  export const withTransaction: (
    name: string,
    eventType: string,
  ) => <T>(component: ComponentType<T>) => ComponentType<T>;
}
