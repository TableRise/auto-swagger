import { Router } from 'express';
import { MiddlewareBinding, NormalizedRoute } from '../types/internalTypes';
import { validatorMiddleware } from './validatorMiddleware';

function resolveBoundMiddlewares(route: NormalizedRoute, bindings: MiddlewareBinding[]) {
  const matchingBindings = bindings.filter(
    (binding) => binding.basePath === route.effectiveBasePath && !binding.exclude.includes(route.relativePath)
  );

  const prepended = matchingBindings
    .filter((binding) => binding.mode === 'prepend')
    .map((binding) => binding.middleware);
  const appended = matchingBindings
    .filter((binding) => binding.mode === 'append')
    .map((binding) => binding.middleware);

  return {
    prepended,
    appended,
  };
}

export function buildRuntimeRouter(routes: NormalizedRoute[], bindings: MiddlewareBinding[]) {
  const router = Router();

  for (const route of routes) {
    if (!route.controller && route.middlewares.length === 0) {
      throw new Error(`Route ${route.method.toUpperCase()} ${route.fullPath} must have at least one controller or middleware`);
    }

    const boundMiddlewares = resolveBoundMiddlewares(route, bindings);
    const handlers = [
      ...boundMiddlewares.prepended,
      ...route.middlewares,
      ...boundMiddlewares.appended,
      validatorMiddleware(route.schemas, route.requestContentType),
    ];

    if (route.controller) {
      handlers.push(route.controller);
    }

    router[route.method](route.fullPath, ...handlers);
  }

  return router;
}
