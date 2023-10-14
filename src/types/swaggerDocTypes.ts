export type serversUrls = { url: string }[];

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
  servers: serversUrls;
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

export interface swaggerOptions {
  title?: string
  newUrl?: string
}
