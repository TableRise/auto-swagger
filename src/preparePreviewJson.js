const readRoutes = require("./readRoutes");
const pathGenerator = require('./pathMethods/pathGenerator');

function filterUniqueCategories(routesFormated) {
  const categories = [];

  routesFormated.forEach((route) => {
    if (categories.includes(route.category)) return;
    categories.push(route.category);
  });

  return categories;
}

function preparePreviewJson(routesFormated) {
  const swaggerDoc = {
    openapi: '3.0.3',
    info: {
      title: 'Taverna do Mestre',
      contact: {
        email: 'taverna-do-mestre@outlook.com',
        name: 'Taverna-do-Mestre'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      version: '2.0.0'
    },
    servers: [
      {
        url: 'http://127.0.0.1:3001'
      }
    ]
  }

  const categories = filterUniqueCategories(routesFormated);
  swaggerDoc.tags = categories.map((cat) => ({ name: cat }));

  swaggerDoc.paths = pathGenerator(routesFormated);
  return swaggerDoc;
}

/*
  [
    ['/system', 'system', 'get', undefined, zodSchema, { authCode: 'string' }],
    ['/system/:id', 'system', 'getById', { id: 'string' }, zodSchema, { authCode: 'string' }]
  ]
*/

// const routesFormated = readRoutes([
//   ['/system', 'system', 'get', undefined, {
//     name: 'Adson',
//     address: 'Brazil',
//     job: 'IT Analyst'
//   }, { authCode: 'string' }],
//   ['/system', 'system', 'post', undefined, {
//     name: 'Adson',
//     address: 'Brazil',
//     job: 'IT Analyst'
//   }, { authCode: 'string' }],
// ]);

// const swagger = preparePreviewJson(routesFormated);
// console.log(swagger);
