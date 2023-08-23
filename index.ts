import readRoutes from'./src/readRoutes';
import preparePreviewJson from'./src/preparePreviewJson';

const fs = require('fs').promises;

export default async function generateSwaggerDoc(routes) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile('api-docs/swagger-doc.json', JSON.stringify(newSwaggerDoc), { flag: 'w' });
  } catch (error) {
    console.log(error);
  }
}
