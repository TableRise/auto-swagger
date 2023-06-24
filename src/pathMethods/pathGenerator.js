const methodGeneratorWithoutRequest = require('./methodGeneratorWithoutRequest');
const methodGeneratorWithRequest = require('./methodGenerator');

module.exports = (routesFormated) => {
  const paths = {};

  routesFormated.forEach((route) => {
    const pathKeys = Object.keys(paths);
    if (pathKeys.includes(route.path)) return;

    paths[route.path] = {};
  });

  routesFormated.forEach((route) => {
    const previousPathMethods = { prev: paths[route.path] };

    const newPathMethod = {
      [route.method]: methodGeneratorWithoutRequest(route)
    };

    paths[route.path] = {
      ...previousPathMethods.prev,
      ...newPathMethod,
    };
  });

  return paths;
}