import { ZodTypeAny } from 'zod';
import { AutoSwaggerDocsConfig, SecurityRequirement } from '../types/publicTypes';
import { NormalizedDocsConfig, NormalizedRoute, OpenApiDocument, OpenApiOperation, OpenApiParameter } from '../types/internalTypes';
import { getSchemaParameterDefinitions, hasFileSchema, zodToOpenApiSchema } from './zodToOpenApi';

const DEFAULT_RESPONSES: OpenApiOperation['responses'] = {
  400: { description: 'Bad Request' },
  401: { description: 'Unauthorized' },
  403: { description: 'Forbidden' },
  404: { description: 'Not Found' },
  422: { description: 'Unprocessable Entity' },
  500: { description: 'Internal' },
};

function createSuccessResponses(method: NormalizedRoute['method']) {
  const responses = { ...DEFAULT_RESPONSES };

  if (method === 'get' || method === 'put' || method === 'patch') {
    responses[200] = { description: 'OK' };
  }

  if (method === 'post') {
    responses[201] = { description: 'Created' };
  }

  if (method === 'delete') {
    responses[204] = { description: 'No Content' };
  }

  return responses;
}

function normalizeServers(config: NormalizedDocsConfig): { url: string }[] {
  return config.servers;
}

function mergeParameters(route: NormalizedRoute): OpenApiParameter[] {
  const explicitParams = route.parameters.map((parameter) => ({
    name: parameter.name,
    in: parameter.location,
    required: parameter.location === 'path' ? true : parameter.required ?? false,
    description: parameter.description,
    schema: {
      type: parameter.type,
    },
  }));

  const schemaParams = [
    ...getSchemaParameterDefinitions(route.schemas.params, 'path'),
    ...getSchemaParameterDefinitions(route.schemas.query, 'query'),
  ];

  const merged = new Map<string, OpenApiParameter>();

  for (const parameter of schemaParams) {
    merged.set(`${parameter.in}:${parameter.name}`, parameter);
  }

  for (const parameter of explicitParams) {
    merged.set(`${parameter.in}:${parameter.name}`, parameter);
  }

  for (const pathParamName of route.pathParamNames) {
    const key = `path:${pathParamName}`;
    if (!merged.has(key)) {
      merged.set(key, {
        name: pathParamName,
        in: 'path',
        required: true,
        schema: { type: 'string' },
      });
    }
  }

  return Array.from(merged.values());
}

function resolveRequestBody(route: NormalizedRoute) {
  if (!route.schemas.body) {
    return undefined;
  }

  const contentType = route.requestContentType ?? (hasFileSchema(route.schemas.body) ? 'multipart/form-data' : 'application/json');

  return {
    content: {
      [contentType]: {
        schema: zodToOpenApiSchema(route.schemas.body as ZodTypeAny),
      },
    },
  };
}

function resolveSecurity(route: NormalizedRoute): SecurityRequirement[] | undefined {
  if (route.security === undefined) {
    return undefined;
  }

  return route.security;
}

function createOperation(route: NormalizedRoute): OpenApiOperation {
  const operation: OpenApiOperation = {
    tags: [route.tag],
    responses: createSuccessResponses(route.method),
  };

  const parameters = mergeParameters(route);
  if (parameters.length > 0) {
    operation.parameters = parameters;
  }

  if (route.description) {
    operation.description = route.description;
  }

  const requestBody = resolveRequestBody(route);
  if (requestBody) {
    operation.requestBody = requestBody;
  }

  const security = resolveSecurity(route);
  if (security !== undefined) {
    operation.security = security;
  }

  return operation;
}

export function generateOpenApiDocument(
  group: string,
  routes: NormalizedRoute[],
  docsConfig: NormalizedDocsConfig
): OpenApiDocument {
  const paths: OpenApiDocument['paths'] = {};
  const tags = new Set<string>();

  for (const route of routes.filter((item) => !item.hide)) {
    tags.add(route.tag);
    paths[route.openApiPath] ??= {};

    if (paths[route.openApiPath][route.method]) {
      throw new Error(`Duplicate OpenAPI operation for group "${group}" at ${route.method.toUpperCase()} ${route.openApiPath}`);
    }

    paths[route.openApiPath][route.method] = createOperation(route);
  }

  const document: OpenApiDocument = {
    openapi: '3.0.3',
    info: {
      title: docsConfig.title,
      version: docsConfig.version,
      description: docsConfig.description,
    },
    servers: normalizeServers(docsConfig),
    tags: Array.from(tags).sort().map((tag) => ({ name: tag })),
    paths,
  };

  if (Object.keys(docsConfig.securitySchemes).length > 0) {
    document.components = {
      securitySchemes: docsConfig.securitySchemes,
    };
  }

  return document;
}
