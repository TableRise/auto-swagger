import fs from 'fs';
import path from 'path';
import { Handler, Request, Response, Router } from 'express';
import { generateOpenApiDocument } from '../docs/generateOpenApiDocument';
import { normalizeRouteCollection } from '../normalize/normalizeRouteCollection';
import { buildRuntimeRouter } from '../router/buildRuntimeRouter';
import {
  AutoSwaggerConfig,
  BindMiddlewareOptions,
  ProvideRoutesOptions,
  routeInstance,
} from '../types/publicTypes';
import {
  MiddlewareBinding,
  NormalizedDocsConfig,
  NormalizedRegistration,
  NormalizedRoute,
  RegistrationRecord,
} from '../types/internalTypes';

function normalizeMountPath(mountPath?: string) {
  if (!mountPath) {
    return '/api-docs';
  }

  return mountPath.startsWith('/') ? mountPath : `/${mountPath}`;
}

function normalizeDocsConfig(config: AutoSwaggerConfig = {}): NormalizedDocsConfig {
  const docs = config.docs ?? {};
  const outputDir = docs.outputDir ?? 'api-docs';
  const resolvedServers = (docs.servers ?? []).map((server) =>
    typeof server === 'string' ? { url: server } : server
  );

  return {
    description: docs.description,
    defaultSecurityScheme: docs.defaultSecurityScheme,
    indexTitle: docs.indexTitle ?? 'Swagger Docs',
    mountPath: normalizeMountPath(docs.mountPath),
    outputDir: path.resolve(process.cwd(), outputDir),
    securitySchemes: docs.securitySchemes ?? {},
    servers: resolvedServers,
    title: docs.title ?? 'TableRise',
    version: docs.version ?? '1.0.0',
  };
}

function normalizeBasePath(basePath: string): string {
  const withSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

function normalizeRelativePath(pathValue: string): string {
  const withSlash = pathValue.startsWith('/') ? pathValue : `/${pathValue}`;
  return withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
}

export class AutoSwaggerRegistry {
  private readonly docsConfig: NormalizedDocsConfig;

  private readonly bindings: MiddlewareBinding[] = [];

  private readonly registrations = new Map<string, RegistrationRecord>();

  private registrationCounter = 0;

  constructor(config: AutoSwaggerConfig = {}) {
    this.docsConfig = normalizeDocsConfig(config);
  }

  getDocsConfig() {
    return this.docsConfig;
  }

  listGroups(): string[] {
    return Array.from(new Set(Array.from(this.registrations.values()).map((registration) => registration.group))).sort();
  }

  hasGroup(group: string): boolean {
    return Array.from(this.registrations.values()).some((registration) => registration.group === group);
  }

  getDocFilePath(group: string): string {
    return path.join(this.docsConfig.outputDir, `swagger-doc-${group}.json`);
  }

  registerCollection(entries: routeInstance[], options: ProvideRoutesOptions): string {
    const registrationId = `registration-${++this.registrationCounter}`;
    const normalized = normalizeRouteCollection(registrationId, entries, options, this.docsConfig);
    const delegateRouter = Router();

    delegateRouter.use((req: Request, res: Response, next) => {
      const router = this.getCompiledRouter(registrationId);
      return router(req, res, next);
    });

    this.registrations.set(registrationId, {
      ...normalized,
      delegateRouter,
      routerDirty: true,
    });

    this.ensureGroupDocsWritten(options.group);
    return registrationId;
  }

  createDelegatingRouter(registrationId: string): Router {
    const registration = this.registrations.get(registrationId);

    if (!registration) {
      throw new Error(`Unknown registration "${registrationId}"`);
    }

    return registration.delegateRouter;
  }

  bindMiddleware(basePath: string, middleware: Handler, options: BindMiddlewareOptions = {}) {
    const normalizedBinding: MiddlewareBinding = {
      basePath: normalizeBasePath(basePath),
      exclude: (options.exclude ?? []).map((value) => normalizeRelativePath(value)),
      middleware,
      mode: options.mode ?? 'append',
    };

    this.bindings.push(normalizedBinding);

    const affectedGroups = new Set<string>();

    for (const registration of this.registrations.values()) {
      const matchesRegistration = registration.routes.some((route) => route.effectiveBasePath === normalizedBinding.basePath);

      if (matchesRegistration) {
        registration.routerDirty = true;
        affectedGroups.add(registration.group);
      }
    }

    affectedGroups.forEach((group) => this.ensureGroupDocsWritten(group));
  }

  getCompiledRouter(registrationId: string): Router {
    const registration = this.registrations.get(registrationId);

    if (!registration) {
      throw new Error(`Unknown registration "${registrationId}"`);
    }

    if (!registration.compiledRouter || registration.routerDirty) {
      registration.compiledRouter = buildRuntimeRouter(registration.routes, this.bindings);
      registration.routerDirty = false;
    }

    return registration.compiledRouter;
  }

  getResolvedRoutesForGroup(group: string): NormalizedRoute[] {
    return Array.from(this.registrations.values())
      .filter((registration) => registration.group === group)
      .flatMap((registration) => registration.routes.map((route) => this.resolveRouteForDocs(route)));
  }

  private resolveRouteForDocs(route: NormalizedRoute): NormalizedRoute {
    return {
      ...route,
      security: route.routeLevelSecurity,
    };
  }

  private ensureOutputDirectory() {
    try {
      fs.mkdirSync(this.docsConfig.outputDir, { recursive: true });
    } catch (error) {
      throw new Error(`Unable to create Swagger output directory at "${this.docsConfig.outputDir}"`);
    }
  }

  ensureGroupDocsWritten(group: string) {
    this.ensureOutputDirectory();

    const routes = this.getResolvedRoutesForGroup(group);
    const document = generateOpenApiDocument(group, routes, this.docsConfig);
    const filePath = this.getDocFilePath(group);

    try {
      fs.writeFileSync(filePath, JSON.stringify(document, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Unable to write Swagger document for group "${group}" to "${filePath}"`);
    }
  }
}
