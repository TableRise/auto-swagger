import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import {
  renderDocsIndex,
  renderDocsStylesheet,
  renderGroupPage,
  renderSwaggerInitializer,
} from './renderDocsUi';
import { AutoSwaggerRegistry } from '../registry/AutoSwaggerRegistry';

const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const docsLogoExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico', 'avif'];

function resolveDocsLogo(outputDir: string, mountPath: string) {
  for (const extension of docsLogoExtensions) {
    const filePath = path.join(outputDir, `logo.${extension}`);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return {
        extension,
        filePath,
        publicPath: `${mountPath}/logo.${extension}`,
      };
    }
  }

  return undefined;
}

export function buildDocsRouter(registry: AutoSwaggerRegistry): Router {
  const router = Router();
  const docsConfig = registry.getDocsConfig();
  const mountPath = docsConfig.mountPath;

  router.use(`${mountPath}/assets`, express.static(swaggerUiAssetPath));

  router.get(mountPath, (_req: Request, res: Response) => {
    const groups = registry.listGroups();
    const logo = resolveDocsLogo(docsConfig.outputDir, mountPath);
    res.type('html').send(renderDocsIndex(docsConfig.indexTitle, mountPath, groups, logo?.publicPath));
  });

  router.get(`${mountPath}/docs.css`, (_req: Request, res: Response) => {
    res.type('text/css').send(renderDocsStylesheet());
  });

  router.get(`${mountPath}/logo.:extension`, (req: Request, res: Response) => {
    const logo = resolveDocsLogo(docsConfig.outputDir, mountPath);

    if (!logo || req.params.extension.toLowerCase() !== logo.extension) {
      res.status(404).type('text/plain').send('Swagger logo not found');
      return;
    }

    res.sendFile(logo.filePath);
  });

  router.get(`${mountPath}/:group/swagger.json`, (req: Request, res: Response) => {
    const group = req.params.group;

    if (!registry.hasGroup(group)) {
      res.status(404).json({ message: `Unknown Swagger group "${group}"` });
      return;
    }

    const filePath = registry.getDocFilePath(group);
    res.sendFile(path.resolve(filePath));
  });

  router.get(`${mountPath}/:group/swagger-initializer.js`, (req: Request, res: Response) => {
    const group = req.params.group;

    if (!registry.hasGroup(group)) {
      res.status(404).type('text/plain').send(`Unknown Swagger group "${group}"`);
      return;
    }

    res
      .type('application/javascript')
      .send(renderSwaggerInitializer(mountPath, group));
  });

  router.get(`${mountPath}/:group`, (req: Request, res: Response) => {
    const group = req.params.group;

    if (!registry.hasGroup(group)) {
      res.status(404).type('html').send(`<p>Unknown Swagger group "${group}"</p>`);
      return;
    }

    const logo = resolveDocsLogo(docsConfig.outputDir, mountPath);
    res.type('html').send(renderGroupPage(docsConfig.title, docsConfig.version, mountPath, group, logo?.publicPath));
  });

  return router;
}
