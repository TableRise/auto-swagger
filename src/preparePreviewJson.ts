import { routeFormatedTypes } from './types/routesTypes';
import { swaggerDocTypes } from './types/swaggerDocTypes';

const pathGenerator = require('./pathMethods/pathGenerator');

function filterUniqueCategories(routesFormated: routeFormatedTypes[]) {
  const categories = [];

  routesFormated.forEach((route) => {
    if (categories.includes(route.category)) return;
    categories.push(route.category);
  });

  return categories;
}

module.exports = (routesFormated: routeFormatedTypes[]) => {
  const swaggerDoc: swaggerDocTypes = {
    openapi: '3.0.3',
    info: {
      title: 'TableRise',
      contact: {
        email: 'tablerise@outlook.com',
        name: 'tablerise',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      version: '2.1.0',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  };

  const categories = filterUniqueCategories(routesFormated);
  swaggerDoc.tags = categories.map((cat) => ({ name: cat }));

  swaggerDoc.paths = pathGenerator(routesFormated);
  swaggerDoc.components = {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  };

  return swaggerDoc;
};
