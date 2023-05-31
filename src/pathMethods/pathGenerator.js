const methodGeneratorWithoutRequest = require('./methodGeneratorWithoutRequest');
const methodGeneratorWithRequest = require('./methodGeneratorWithRequest');

module.exports = (routesFormated) => {
  const paths = {};

  routesFormated.forEach((route) => {
    const pathKeys = Object.keys(paths);
    if (pathKeys.includes(route.path)) return;

    paths[route.path] = {};
  });

  routesFormated.forEach((route) => {
    const previousPathMethods = { prev: paths[route.path] };

    if (route.method === 'get' || route.method === 'delete') {
      const newPathMethod = {
        [route.method]: methodGeneratorWithoutRequest(route)
      };

      paths[route.path] = {
        ...previousPathMethods.prev,
        ...newPathMethod,
      };
    }

    if (route.method === 'post' || route.method === 'put' || route.method === 'patch') {
      const newPathMethod = {
        [route.method]: methodGeneratorWithRequest(route)
      };

      paths[route.path] = {
        ...previousPathMethods.prev,
        ...newPathMethod,
      };
    }
  });

  return paths;
}