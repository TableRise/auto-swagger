const readRoutes = require('./src/readRoutes');
const preparePreviewJson = require('./src/preparePreviewJson');
const contentComparison = require('./src/contentComparison');

const fs = require('fs').promises;

async function generateSwaggerDoc(routes) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated);

  try {
    const prevSwagger = await fs.readFile('api-docs/swagger-doc.json', { encoding: 'utf-8', flag: 'r' });

    const compareDocs = contentComparison(prevSwagger, newSwaggerDoc);

    if (compareDocs) {
      console.log(':: Swagger Document Up-To-Date ::');
      return;
    };

    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile('api-docs/swagger-doc.json', JSON.stringify(newSwaggerDoc), { flag: 'w' });
  } catch (error) {
    console.log(error);
  }
}

module.exports = generateSwaggerDoc;
