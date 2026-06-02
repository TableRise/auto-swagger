import { Handler, Router } from 'express';
import { ZodTypeAny } from 'zod';

export type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options' | 'head';
export type OpenApiPrimitiveType = 'string' | 'number' | 'integer' | 'boolean';
export type SecurityRequirement = Record<string, string[]>;
export type AutoSwaggerDocsTheme = 'default' | 'white' | 'orange' | 'green' | 'purple';

export interface RouteSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export interface RouteOptions {
  authentication?: boolean | string | SecurityRequirement[];
  description?: string;
  middlewares?: Handler[];
  requestContentType?: 'application/json' | 'multipart/form-data';
  schemas?: RouteSchemas | RouteSchemas[];
  security?: string | SecurityRequirement[];
  tag?: string;
}

export interface RouteCollectionDefinition {
  basePath: string;
}

export interface RouteDefinition {
  basePath?: string;
  controller?: Handler;
  hide?: boolean;
  method: HttpMethod;
  options?: RouteOptions;
  path: string;
}

export type routeInstance = RouteCollectionDefinition | RouteDefinition;

export interface ProvideRoutesOptions {
  group: string;
}

export interface BindMiddlewareOptions {
  exclude?: string[];
  mode?: 'prepend' | 'append';
}

export interface AutoSwaggerDocsConfig {
  defaultSecurityScheme?: string;
  description?: string;
  indexTitle?: string;
  mountPath?: string;
  outputDir?: string;
  securitySchemes?: Record<string, unknown>;
  servers?: Array<string | { url: string }>;
  theme?: AutoSwaggerDocsTheme;
  title?: string;
  version?: string;
}

export interface AutoSwaggerConfig {
  docs?: AutoSwaggerDocsConfig;
  logs?: boolean;
}

export interface ProvidedRoutesRegistration {
  register(): Router;
}

export interface AutoSwaggerInstance {
  bindMiddleware(basePath: string, middleware: Handler, options?: BindMiddlewareOptions): AutoSwaggerInstance;
  docs(): Router;
  provideRoutes(routeEntries: routeInstance[], options: ProvideRoutesOptions): ProvidedRoutesRegistration;
}
