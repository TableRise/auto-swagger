const readRoutes = require('./src/readRoutes');
const preparePreviewJson = require('./src/preparePreviewJson');

const fs = require('fs').promises;

async function generateSwaggerDoc(routes) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile('api-docs/swagger-doc.json', JSON.stringify(newSwaggerDoc), { flag: 'w' });
  } catch (error) {
    console.log(error);
  }
}

module.exports = generateSwaggerDoc;
