import { routeFormatedTypes, routeInstance } from './types/routesTypes';

export default (routes: routeInstance[]): routeFormatedTypes[] => {
  const routesToProcess = routes.filter((route) => !route.hide);
  const routesFormated = routesToProcess.map((route) => ({
      path: route.path.replace(':id', '{id}'),
      category: route.options.tag,
      method: route.method,
      params: route.parameters,
      description: route.options.description,
      schemaRequest: route.schema,
      auth: route.options.authentication,
  }));

  return routesFormated;
};
