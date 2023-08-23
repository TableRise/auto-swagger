export interface swaggerDocTypes {
  openapi: string;
  info: {
    title: string;
    contact: {
      email: string;
      name: string;
    };
    license: {
      name: string;
      url: string;
    };
    version: string;
  };
  servers: [
    {
      url: string;
    }
  ];
  tags?: {
    name: string;
  }[];
  paths?: any;
  components?: {
    securitySchemes: {
      bearerAuth: {
        type: string;
        scheme: string;
        bearerFormat: string;
      };
    };
  };
}
