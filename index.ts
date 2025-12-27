import readRoutes from'./src/readRoutes';
import preparePreviewJson from'./src/preparePreviewJson';
import { routeInstance } from './src/types/routesTypes';
import { swaggerOptions } from './src/types/swaggerDocTypes';
import { Router } from 'express';
import { validatorMiddleware } from './src/pathMethods/validatorMiddleware';

const fs = require('fs').promises;

export default async function generateSwaggerDoc(routes: routeInstance[], options: swaggerOptions = {} as swaggerOptions) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated, options);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile(options.title
      ? `api-docs/swagger-doc-${options.title}.json`
      : 'api-docs/swagger-doc.json',
      JSON.stringify(newSwaggerDoc),
      { flag: 'w' }
    );
  } catch (error) {
    console.log(error);
  }
}

export function buildRouter(routes: routeInstance[], router: Router): Router {
  routes.forEach((route) => {
    if (!route.controller && !route.options.middlewares) throw new Error('Route must have at least one controller or middleware');

    if (route.controller && !route.options.middlewares) return router[route.method](
      route.path,
      validatorMiddleware(route.options.validator),
      route.controller
    );

    if (!route.controller && route.options.middlewares.length) return router[route.method](
      route.path,
      validatorMiddleware(route.options.validator),
      ...route.options.middlewares
    );

    if (route.options.middlewares.length === 0) throw new Error('Middlewares property can not be an empty array');

    if (route.controller && route.options.middlewares.length) return router[route.method](
      route.path,
      validatorMiddleware(route.options.validator),
      ...route.options.middlewares,
      route.controller
    );
  });

  return router;
}

export { routeInstance };
