const pathGenerator = require('./pathMethods/pathGenerator');

function filterUniqueCategories(routesFormated) {
  const categories = [];

  routesFormated.forEach((route) => {
    if (categories.includes(route.category)) return;
    categories.push(route.category);
  });

  return categories;
}

module.exports = (routesFormated) => {
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
        url: 'http://localhost:3001'
      }
    ]
  }

  const categories = filterUniqueCategories(routesFormated);
  swaggerDoc.tags = categories.map((cat) => ({ name: cat }));

  swaggerDoc.paths = pathGenerator(routesFormated);
  swaggerDoc.components = {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }

  return swaggerDoc;
}
