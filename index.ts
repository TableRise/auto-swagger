import readRoutes from'./src/readRoutes';
import preparePreviewJson from'./src/preparePreviewJson';
import { routeOriginal } from './src/types/routesTypes';

const fs = require('fs').promises;

export default async function generateSwaggerDoc(routes: routeOriginal) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile('api-docs/swagger-doc.json', JSON.stringify(newSwaggerDoc), { flag: 'w' });
  } catch (error) {
    console.log(error);
  }
}
