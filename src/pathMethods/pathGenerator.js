const getGenerator = require('./getGenerator');

module.exports = (routesFormated) => {
  const paths = {};

  routesFormated.forEach((route) => {
    const pathKeys = Object.keys(paths);
    if (pathKeys.includes(route.path)) return;

    paths[route.path] = {};
  });

  routesFormated.forEach((route) => {
    const previousPathMethods = { prev: paths[route.path] };

    if (route.method === 'get') {
      const newPathMethod = {
        [route.method]: getGenerator(route)
      };

      paths[route.path] = {
        ...previousPathMethods.prev,
        ...newPathMethod,
      };
    }
  });

  return paths;
}