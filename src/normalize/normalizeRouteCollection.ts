import { ZodTypeAny } from 'zod';
import {
  ProvideRoutesOptions,
  RouteCollectionDefinition,
  RouteDefinition,
  RouteParameter,
  RouteSchemas,
  SecurityRequirement,
  routeInstance,
} from '../types/publicTypes';
import { NormalizedDocsConfig, NormalizedRegistration } from '../types/internalTypes';

function normalizeLeadingSlash(value: string): string {
  return value.startsWith('/') ? value : `/${value}`;
}

function normalizeBasePath(value: string): string {
  const withSlash = normalizeLeadingSlash(value.trim());
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

function normalizeRelativePath(value: string): string {
  const withSlash = normalizeLeadingSlash(value.trim());
  return withSlash === '/' ? withSlash : withSlash.replace(/\/+$/, '');
}

function joinPaths(basePath: string, relativePath: string): string {
  if (relativePath === '/') {
    return basePath;
  }

  if (basePath === '/') {
    return relativePath;
  }

  return `${basePath}${relativePath}`;
}

function expressPathToOpenApi(path: string): string {
  return path.replace(/:([A-Za-z0-9_]+)/g, '{$1}');
}

function extractPathParamNames(path: string): string[] {
  return Array.from(path.matchAll(/:([A-Za-z0-9_]+)/g)).map((match) => match[1]);
}

function normalizeSchemas(input?: RouteDefinition['options'] extends { schemas?: infer T } ? T : never): RouteSchemas {
  if (!input) {
    return {};
  }

  if (!Array.isArray(input)) {
    return input;
  }

  return input.reduce<RouteSchemas>((accumulator, schemaPart) => ({ ...accumulator, ...schemaPart }), {});
}

function normalizeParameterType(type?: string): RouteParameter['type'] {
  if (!type) {
    return 'string';
  }

  const supportedTypes = new Set(['string', 'number', 'integer', 'boolean']);
  return supportedTypes.has(type) ? (type as RouteParameter['type']) : 'string';
}

function normalizeParameters(parameters: RouteDefinition['parameters'] = []): RouteParameter[] {
  return parameters.map((parameter) => ({
    name: parameter.name,
    location: parameter.location,
    required: parameter.location === 'path' ? true : parameter.required ?? false,
    description: parameter.description,
    type: normalizeParameterType(parameter.type),
  }));
}

function normalizeSecurity(
  value: RouteDefinition['options'] extends { security?: infer T } ? T : never,
  authentication: RouteDefinition['options'] extends { authentication?: infer T } ? T : never,
  docsConfig: NormalizedDocsConfig
): SecurityRequirement[] | undefined {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return [{ [value]: [] }];
  }

  if (Array.isArray(authentication)) {
    return authentication as SecurityRequirement[];
  }

  if (typeof authentication === 'string') {
    return [{ [authentication]: [] }];
  }

  if (authentication === true && docsConfig.defaultSecurityScheme) {
    return [{ [docsConfig.defaultSecurityScheme]: [] }];
  }

  if (authentication === false) {
    return [];
  }

  return undefined;
}

function isCollectionDefinition(entry: routeInstance): entry is RouteCollectionDefinition {
  return typeof (entry as RouteCollectionDefinition).basePath === 'string' && !(entry as RouteDefinition).method;
}

export function normalizeRouteCollection(
  id: string,
  entries: routeInstance[],
  options: ProvideRoutesOptions,
  docsConfig: NormalizedDocsConfig
): NormalizedRegistration {
  const normalizedGroup = typeof options.group === 'string' ? options.group.trim() : '';

  if (!normalizedGroup) {
    throw new Error('provideRoutes(...) requires a non-empty group');
  }

  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error(`Route collection for group "${normalizedGroup}" can not be empty`);
  }

  const [firstEntry, ...routeEntries] = entries;

  if (!isCollectionDefinition(firstEntry)) {
    throw new Error(`Route collection for group "${normalizedGroup}" must start with a { basePath: string } entry`);
  }

  const collectionBasePath = normalizeBasePath(firstEntry.basePath);

  if (routeEntries.length === 0) {
    throw new Error(`Route collection for group "${normalizedGroup}" must include at least one route entry`);
  }

  const routes = routeEntries.map((entry, index) => {
    const routeEntry = entry as RouteDefinition;

    if (!routeEntry.method) {
      throw new Error(`Invalid route entry at index ${index + 1} for group "${normalizedGroup}"`);
    }

    if (!routeEntry.path) {
      throw new Error(`Route entry at index ${index + 1} for group "${normalizedGroup}" is missing a path`);
    }

    const relativePath = normalizeRelativePath(routeEntry.path);
    const effectiveBasePath = normalizeBasePath(routeEntry.basePath ?? collectionBasePath);
    const runtimePath = joinPaths(effectiveBasePath, relativePath);
    const pathParamNames = extractPathParamNames(runtimePath);
    const optionsData = routeEntry.options ?? {};
    const schemas = normalizeSchemas(optionsData.schemas);
    const requestContentType = optionsData.requestContentType;

    return {
      description: optionsData.description,
      effectiveBasePath,
      fullPath: runtimePath,
      group: normalizedGroup,
      hide: routeEntry.hide ?? false,
      method: routeEntry.method,
      middlewares: optionsData.middlewares ?? [],
      openApiPath: expressPathToOpenApi(runtimePath),
      parameters: normalizeParameters(routeEntry.parameters),
      pathParamNames,
      relativePath,
      requestContentType,
      routeLevelSecurity: normalizeSecurity(optionsData.security, optionsData.authentication, docsConfig),
      schemas,
      tag: optionsData.tag ?? normalizedGroup,
      controller: routeEntry.controller,
    };
  });

  return {
    id,
    group: normalizedGroup,
    collectionBasePath,
    routes,
  };
}
