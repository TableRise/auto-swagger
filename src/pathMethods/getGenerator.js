module.exports = (getRoute) => {
  const newPathGET = {
    tags: [],
    security: [ { bearerAuth: [] } ],
    responses: {
      200: {
        description: 'OK',
        content: {
          ['application/json']: {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {} //generatePropertiesForPathGetMethods(route)
              }
            }
          }
        }
      },
      404: {
        description: 'Data not found'
      }
    }
  }

  return newPathGET;
}