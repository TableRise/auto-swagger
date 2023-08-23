import { routeFormatedTypes } from './types/routesTypes';

module.exports = (routes: [any]): routeFormatedTypes[] => {
  const routesFormated = routes.map((route) => ({
    path: route[0],
    category: route[1],
    method: route[2],
    params: route[3] ? route[3] : undefined,
    schemaResponse: route[4] ? route[4] : undefined,
    schemaRequest: route[5] ? route[5] : undefined,
    auth: route[6] ? route[6] : false,
  }));

  return routesFormated;
};
