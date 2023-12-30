import { routeFormatedTypes } from './types/routesTypes';
import { serversUrls, swaggerDocTypes, swaggerOptions } from './types/swaggerDocTypes';
import pathGenerator from './pathMethods/pathGenerator';

function filterUniqueCategories(routesFormated: routeFormatedTypes[]): string[] {
  const categories = [];

  routesFormated.forEach((route) => {
    if (categories.includes(route.category)) return;
    categories.push(route.category);
  });

  return categories;
}

export default (routesFormated: routeFormatedTypes[], options: swaggerOptions) => {
  const swaggerDoc: swaggerDocTypes = {
    openapi: '3.0.3',
    info: {
      title: options.title ? `TableRise - ${options.title}` : 'TableRise',
      contact: {
        email: 'tablerise@outlook.com',
        name: 'tablerise',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      version: '3.0.0',
    },
    servers: [
      { url: 'https://localhost:3001/' },
      { url: 'https://server.tablerise.com/' },
      { url: 'https://server.qa.tablerise.com/' }
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
