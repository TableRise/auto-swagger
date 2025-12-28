import { ZodType } from 'zod';

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
export type description = string;
export type fileUpload = boolean;

export interface routeInstance {
  path: path;
  method: method;
  parameters: params;
  controller: unknown;
  options: {
    middlewares: unknown[];
    authentication: auth;
    description: description;
    validator?: { schema: ZodType, generateSwaggerExample: boolean };
    tag: category;
    fileUpload: fileUpload;
  };
  hide: boolean;
}

export interface routeFormatedTypes {
  path: routeInstance['path'];
  category: routeInstance['options']['tag'];
  method: routeInstance['method'];
  params: routeInstance['parameters'];
  description: routeInstance['options']['description'];
  validator?: routeInstance['options']['validator'];
  auth: routeInstance['options']['authentication'];
  file: routeInstance['options']['fileUpload'];
}
