import express, { Request, Response, Router } from 'express';
import path from 'path';
import { AutoSwaggerRegistry } from '../registry/AutoSwaggerRegistry';

const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();

function renderDocsIndex(title: string, mountPath: string, groups: string[]) {
  const links = groups
    .map((group) => `<li><a href="${mountPath}/${group}">${group}</a></li>`)
    .join('');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 2rem; }
      h1 { margin-bottom: 1rem; }
      ul { padding-left: 1.25rem; }
      li { margin-bottom: 0.5rem; }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>Available Swagger groups</p>
    <ul>${links || '<li>No groups registered.</li>'}</ul>
  </body>
</html>`;
}

function renderGroupPage(title: string, mountPath: string, group: string) {
  const assetsPath = `${mountPath}/assets`;
  const initializerPath = `${mountPath}/${group}/swagger-initializer.js`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title} - ${group}</title>
    <link rel="stylesheet" href="${assetsPath}/swagger-ui.css" />
    <style>
      html { box-sizing: border-box; overflow-y: scroll; }
      *, *:before, *:after { box-sizing: inherit; }
      body { margin: 0; background: #fafafa; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="${assetsPath}/swagger-ui-bundle.js"></script>
    <script src="${assetsPath}/swagger-ui-standalone-preset.js"></script>
    <script src="${initializerPath}"></script>
  </body>
</html>`;
}

function renderSwaggerInitializer(mountPath: string, group: string) {
  const swaggerJsonUrl = `${mountPath}/${group}/swagger.json`;

  return `window.addEventListener('load', function () {
  window.ui = SwaggerUIBundle({
    url: ${JSON.stringify(swaggerJsonUrl)},
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: 'BaseLayout'
  });
});
`;
}

export function buildDocsRouter(registry: AutoSwaggerRegistry): Router {
  const router = Router();
  const docsConfig = registry.getDocsConfig();
  const mountPath = docsConfig.mountPath;

  router.use(`${mountPath}/assets`, express.static(swaggerUiAssetPath));

  router.get(mountPath, (_req: Request, res: Response) => {
    const groups = registry.listGroups();
    res.type('html').send(renderDocsIndex(docsConfig.indexTitle, mountPath, groups));
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

    res.type('html').send(renderGroupPage(docsConfig.title, mountPath, group));
  });

  return router;
}
