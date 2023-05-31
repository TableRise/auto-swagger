const responseSchemaPropertiesGenerator = require('./responseSchemaPropertiesGenerator');

module.exports = (route) => {
  const newMethod = {
    tags: [],
    responses: {
      400: {
        description: 'Bad Request'
      },
      401: {
        description: 'Unauthorized'
      },
      404: {
        description: 'Not Found'
      },
      422: {
        description: 'Unprocessable Entity'
      },
      500: {
        description: 'Internal'
      }
    }
  }

  if (route.auth) newMethod.security = [ { bearerAuth: [] } ];

  if (route.params) newMethod.parameters = route.params.map((param) => {
    if (param.name === '_id' && !route.path.includes('_id')) {
      throw new Error('Parameter _id must be in path too');
    }

    return {
      name: param.name,
      in: param.location,
      required: param.required,
      schema: {
        type: param.type
      }
    }
  });

  if (route.method === 'get' || route.method === 'put' || route.method === 'patch') newMethod.responses[200] = { description: 'OK' };
  if (route.method === 'post') newMethod.responses[201] = { description: 'Created' };
  if (route.method === 'delete') newMethod.responses[204] = { description: 'No content' };

  if (route.schema) {
    newMethod.requestBody = {
      content: {
        ['application/json']: {
          schema: {
            type: 'object',
            properties: responseSchemaPropertiesGenerator(route.schema, { includeId: true })
          }
        }
      }
    }

    newMethod.responses[200].content = {
      ['application/json']: {
        schema: {
          type: 'object',
          properties: responseSchemaPropertiesGenerator(route.schema, { includeId: true })
        }
      }
    }
  }

  return newMethod;
}