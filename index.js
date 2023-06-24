const readRoutes = require('./src/readRoutes');
const preparePreviewJson = require('./src/preparePreviewJson');

const fs = require('fs').promises;

/**
 * Generate automatically a Json Swagger Document, to provide API documentation.
 *
 * @param   routes A list of arrays where each array is one route of API.
 * 
 * @example ['/endpoint', 'endpoint', 'get', [{
 *  name: '_id',
 *  location: 'path',
 *  required: true,
 *  type: 'string'
 * }], {
 *  name: '',
 *  address: '',
 *  money: 0.00
 * }, true]
 * 
 * [endpoint, category, method, parameters, schema, bearerAuthorization]
 * 
 * Parameters properties: name, location (query, path, header), required (true or false), type: string, number, array ...
 * 
 * @returns Does not have a return but generate a new swagger file under  a choosen folder.
 */
async function generateSwaggerDoc(routes) {
  const routesFormated = readRoutes(routes);
  const newSwaggerDoc = preparePreviewJson(routesFormated);

  try {
    await fs.mkdir('api-docs', { recursive: true });
    await fs.writeFile('api-docs/swagger-doc.json', JSON.stringify(newSwaggerDoc), { flag: 'w' });
  } catch (error) {
    console.log(error);
  }

  console.log(':: Swagger Document Generated ::');
}

module.exports = generateSwaggerDoc;
