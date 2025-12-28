import { methodTypes } from '../types/methodTypes';
import { routeFormatedTypes } from '../types/routesTypes';
import responseSchemaPropertiesGenerator from './responseSchemaPropertiesGenerator';

export default (route: routeFormatedTypes) => {
  const newMethod: methodTypes = {
    tags: [],
    responses: {
      400: {
        description: 'Bad Request',
      },
      401: {
        description: 'Unauthorized',
      },
      403: {
        description: 'Forbidden',
      },
      404: {
        description: 'Not Found',
      },
      422: {
        description: 'Unprocessable Entity',
      },
      500: {
        description: 'Internal',
      },
    },
  };

  newMethod.tags.push(route.category);

  if (route.auth) newMethod.security = [{ bearerAuth: [] }];

  if (route.file) newMethod.consumes = ['multipart/form-data'];

  if (route.params)
    newMethod.parameters = route.params.map((param) => {
      if (param.name === 'id' && !route.path.includes('id')) {
        throw new Error('Parameter _id must be in path too');
      }

      return {
        name: param.name,
        in: param.location,
        required: param.required,
        schema: {
          type: param.type,
        },
      };
    });

  if (
    route.method === 'get' ||
    route.method === 'put' ||
    route.method === 'patch'
  )
    newMethod.responses[200] = { description: 'OK' };
  if (route.method === 'post')
    newMethod.responses[201] = { description: 'Created' };
  if (route.method === 'delete')
    newMethod.responses[204] = { description: 'No content' };

  if (route.description) newMethod.description = route.description;

  if (route.schemas) {
    const schemaToGenerateMock = route.schemas.find((schema) => schema.body);

    if (schemaToGenerateMock) {
      newMethod.requestBody = {
        content: {
          [route.file ? 'multipart/form-data' : 'application/json']: {
            schema: {
              type: 'object',
              properties: responseSchemaPropertiesGenerator(schemaToGenerateMock.body),
            },
          },
        },
      };
    }
  }

  return newMethod;
};
