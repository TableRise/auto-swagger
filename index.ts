import readRoutes from'./src/readRoutes';
import preparePreviewJson from'./src/preparePreviewJson';
import { routeOriginal } from './src/types/routesTypes';
import { swaggerOptions } from './src/types/swaggerDocTypes';

const fs = require('fs').promises;

export default async function generateSwaggerDoc(routes: routeOriginal, options: swaggerOptions = {} as swaggerOptions) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated, options);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile(options.title
      ? `api-docs/swagger-doc-${options.title}.json`
      : 'api-docs/swagger-doc.json',
      JSON.stringify(newSwaggerDoc),
      { flag: 'w' }
    );
  } catch (error) {
    console.log(error);
  }
}

export { routeOriginal };
