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

export interface routeFormatedTypes {
  path: path;
  category: category;
  method: method;
  params: params;
  description: description;
  schemaRequest: schemaRequest;
  auth: auth;
  file: fileUpload;
}

export interface routeInstance {
  path: path;
  method: method;
  parameters: params;
  schema: schemaRequest;
  controller: unknown;
  options: {
    middlewares: unknown[];
    authentication: auth;
    description: description;
    validator?: ZodType;
    tag: category;
    fileUpload: fileUpload;
  };
  hide: boolean;
}
