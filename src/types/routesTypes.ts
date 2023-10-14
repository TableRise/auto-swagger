export type path = string;
export type category = string;
export type method = string;
export type params = {
  name: string;
  location: 'path' | 'query';
  required: boolean;
  type: string
}[]
export type schemaRequest = any;
export type auth = boolean;

export interface routeFormatedTypes {
  path: path;
  category: category;
  method: method;
  params: params;
  schemaRequest: schemaRequest;
  auth: auth;
}

export interface routeInstance {
  path: path,
  method: method,
  parameters: params,
  schema: schemaRequest,
  controller: unknown,
  options: {
    middlewares: unknown[],
    authentication: auth,
    tag: category,
  },
  hide: boolean
}
