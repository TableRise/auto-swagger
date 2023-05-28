/*
  [
    ['/system', 'system', 'get', undefined, zodSchema, { authCode: 'string' }],
    ['/system/:id', 'system', 'getById', { id: 'string' }, zodSchema, { authCode: 'string' }]
  ]
*/

function readRoutes(routes) {
  const arrToInstance = routes.map((route) => ({
    path: route[0],
    categoryName: route[1],
    method: route[2],
    params: route[3] ? route[3] : undefined,
    body: route[4] ? route[4] : undefined,
    headers: route[5] ? route[5] : undefined
  }));

  return arrToInstance;
}

module.exports = readRoutes;
