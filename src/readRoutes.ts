import { routeFormatedTypes, routeInstance } from './types/routesTypes';

export default (routes: routeInstance[]): routeFormatedTypes[] => {
  const routesFormated = routes.map((route) => {
    if (route.hide) return;

    return {
      path: route.path,
      category: route.options.tag,
      method: route.method,
      params: route.parameters,
      schemaRequest: route.schema,
      auth: route.options.authentication,
    }
  });

  return routesFormated;
};
