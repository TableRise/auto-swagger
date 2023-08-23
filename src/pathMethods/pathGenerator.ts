import { routeFormatedTypes } from '../types/routesTypes';
import methodGenerator from './methodGenerator';

export default (routesFormated: routeFormatedTypes[]) => {
  const paths = {};

  routesFormated.forEach((route) => {
    const pathKeys = Object.keys(paths);
    if (pathKeys.includes(route.path)) return;

    paths[route.path] = {};
  });

  routesFormated.forEach((route) => {
    const previousPathMethods = { prev: paths[route.path] };

    const newPathMethod = {
      [route.method]: methodGenerator(route),
    };

    paths[route.path] = {
      ...previousPathMethods.prev,
      ...newPathMethod,
    };
  });

  return paths;
};
