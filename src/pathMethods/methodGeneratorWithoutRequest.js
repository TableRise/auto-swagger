const responseSchemaPropertiesGenerator = require('./responseSchemaPropertiesGenerator');

module.exports = (route) => {
  const newMethod = {
    tags: [],
    responses: {
      200: {
        description: 'OK',
      },
      404: {
        description: 'Data not found'
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

  if (route.schema) {
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