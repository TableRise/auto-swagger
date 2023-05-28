function preparePreviewJson(arrToInstance) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Taverna do Mestre',
      contact: {
        email: 'taverna-do-mestre@outlook.com',
        name: 'Taverna-do-Mestre'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      },
      version: '2.0.0'
    },
    servers: [
      {
        url: 'http://127.0.0.1:3001'
      }
    ],
    tags: arrToInstance
  }
}
