import 'dotenv/config';
import readRoutes from'./src/readRoutes';
import preparePreviewJson from'./src/preparePreviewJson';
import { routeInstance } from './src/types/routesTypes';
import { swaggerOptions } from './src/types/swaggerDocTypes';
import { Router } from 'express';

const fs = require('fs').promises;
const { NODE_ENV } = process.env;

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
  const render = NODE_ENV === 'dev' || NODE_ENV === 'prod';

  routes.forEach((route) => {
    if (!route.controller && !route.options.middlewares) throw new Error('Route must have at least one controller or middleware');
    if (route.controller && !route.options.middlewares) return router[route.method](route.path, route.controller);

    if (!route.controller && route.options.middlewares.length && render) return router[route.method](route.path, ...route.options.middlewares);
    if (!route.controller && route.options.middlewares.length && !render) return router[route.method](route.path);

    if (route.options.middlewares.length === 0) throw new Error('Middlewares property can not be an empty array');

    if (route.controller && route.options.middlewares.length && render) return router[route.method](route.path, ...route.options.middlewares, route.controller);
    if (route.controller && route.options.middlewares.length && !render) return router[route.method](route.path, route.controller);
  });

  return router;
}

export { routeInstance };
