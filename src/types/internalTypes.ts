import { Handler, Router } from 'express';
import {
  AutoSwaggerDocsTheme,
  HttpMethod,
  RouteSchemas,
  SecurityRequirement,
} from './publicTypes';

export interface NormalizedDocsConfig {
  description?: string;
  defaultSecurityScheme?: string;
  indexTitle: string;
  logsEnabled: boolean;
  mountPath: string;
  outputDir: string;
  securitySchemes: Record<string, unknown>;
  servers: { url: string }[];
  theme: AutoSwaggerDocsTheme;
  title: string;
  version: string;
}

export interface NormalizedRoute {
  controller?: Handler;
  description?: string;
  effectiveBasePath: string;
  fullPath: string;
  group: string;
  hide: boolean;
  method: HttpMethod;
  middlewares: Handler[];
  openApiPath: string;
  pathParamNames: string[];
  relativePath: string;
  requestContentType?: 'application/json' | 'multipart/form-data';
  routeLevelSecurity?: SecurityRequirement[];
  schemas: RouteSchemas;
  security?: SecurityRequirement[];
  tag: string;
}

export interface NormalizedRegistration {
  collectionBasePath: string;
  group: string;
  id: string;
  routes: NormalizedRoute[];
}

export interface MiddlewareBinding {
  basePath: string;
  exclude: string[];
  middleware: Handler;
  mode: 'prepend' | 'append';
}

export interface RegistrationRecord extends NormalizedRegistration {
  compiledRouter?: Router;
  delegateRouter: Router;
  routerDirty: boolean;
}

export interface OpenApiParameter {
  description?: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  name: string;
  required: boolean;
  schema: {
    type: string;
  };
}

export interface OpenApiOperation {
  description?: string;
  parameters?: OpenApiParameter[];
  requestBody?: {
    content: Record<string, { schema: unknown }>;
  };
  responses: Record<number, { description: string }>;
  security?: SecurityRequirement[];
  tags: string[];
}

export interface OpenApiDocument {
  components?: {
    securitySchemes: Record<string, unknown>;
  };
  info: {
    description?: string;
    title: string;
    version: string;
  };
  openapi: string;
  paths: Record<string, Partial<Record<HttpMethod, OpenApiOperation>>>;
  servers: { url: string }[];
  tags: Array<{ name: string }>;
}
