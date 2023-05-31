module.exports = (routes) => {
  const routesFormated = routes.map((route) => ({
    path: route[0],
    category: route[1],
    method: route[2],
    params: route[3] ? route[3] : undefined,
    schema: route[4] ? route[4] : undefined,
    auth: route[5] ? route[5] : false,
  }));

  return routesFormated;
}
