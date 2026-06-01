import { Router } from 'express';
import { buildDocsRouter } from './docs/buildDocsRouter';
import { AutoSwaggerRegistry } from './registry/AutoSwaggerRegistry';
import {
  AutoSwaggerConfig,
  AutoSwaggerInstance,
  BindMiddlewareOptions,
  ProvideRoutesOptions,
  routeInstance,
} from './types/publicTypes';

export function createAutoSwagger(config: AutoSwaggerConfig = {}): AutoSwaggerInstance {
  const registry = new AutoSwaggerRegistry(config);

  return {
    provideRoutes(routeEntries: routeInstance[], options: ProvideRoutesOptions) {
      let registrationId: string | undefined;
      let delegateRouter: Router | undefined;

      return {
        register(): Router {
          if (!registrationId) {
            registrationId = registry.registerCollection(routeEntries, options);
            delegateRouter = registry.createDelegatingRouter(registrationId);
          }

          return delegateRouter as Router;
        },
      };
    },

    bindMiddleware(basePath, middleware, options: BindMiddlewareOptions = {}) {
      registry.bindMiddleware(basePath, middleware, options);
      return this;
    },

    docs() {
      return buildDocsRouter(registry);
    },
  };
}
