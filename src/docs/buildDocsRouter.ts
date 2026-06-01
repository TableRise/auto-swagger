import express, { Request, Response, Router } from 'express';
import fs from 'fs';
import path from 'path';
import { AutoSwaggerRegistry } from '../registry/AutoSwaggerRegistry';

const swaggerUiAssetPath = require('swagger-ui-dist').getAbsoluteFSPath();
const docsLogoRelativePath = path.join('assets', 'img', 'logo.png');

function renderDocsStylesheet() {
  return `:root {
  color-scheme: dark;
  --docs-bg: #0a0f1f;
  --docs-bg-accent: #121a31;
  --docs-surface: rgba(11, 18, 37, 0.88);
  --docs-surface-strong: rgba(16, 24, 46, 0.96);
  --docs-border: rgba(138, 162, 255, 0.18);
  --docs-border-strong: rgba(138, 162, 255, 0.32);
  --docs-text: #edf2ff;
  --docs-text-muted: #aebad6;
  --docs-link: #8fb4ff;
  --docs-link-strong: #bfd3ff;
  --docs-shadow: 0 24px 60px rgba(0, 0, 0, 0.38);
  --docs-radius: 22px;
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background:
    radial-gradient(circle at top, rgba(76, 120, 255, 0.18), transparent 32rem),
    linear-gradient(180deg, #0d1427 0%, #070b16 100%);
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--docs-text);
  background: transparent;
  font-family: "Segoe UI", "Inter", sans-serif;
}

a {
  color: var(--docs-link);
}

.docs-shell {
  width: min(1120px, calc(100% - 2rem));
  margin: 0 auto;
}

.docs-hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  padding: 3rem 0 1.5rem;
}

.docs-eyebrow {
  margin: 0 0 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.78rem;
  color: var(--docs-link);
}

.docs-title {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3.4rem);
  line-height: 0.95;
}

.docs-title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.docs-logo {
  width: clamp(3rem, 5vw, 4.25rem);
  height: clamp(3rem, 5vw, 4.25rem);
  object-fit: contain;
  flex: none;
  filter: drop-shadow(0 10px 24px rgba(0, 0, 0, 0.28));
}

.docs-subtitle {
  margin: 0.8rem 0 0;
  max-width: 48rem;
  color: var(--docs-text-muted);
  line-height: 1.6;
}

.docs-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1rem;
  border: 1px solid var(--docs-border-strong);
  border-radius: 999px;
  color: var(--docs-link-strong);
  background: rgba(16, 24, 46, 0.72);
  text-decoration: none;
}

.docs-panel {
  padding: 1.4rem;
  border: 1px solid var(--docs-border);
  border-radius: var(--docs-radius);
  background: var(--docs-surface);
  box-shadow: var(--docs-shadow);
  backdrop-filter: blur(14px);
}

.docs-group-list {
  list-style: none;
  margin: 1.25rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.docs-group-link {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--docs-border);
  border-radius: 16px;
  background: rgba(17, 25, 48, 0.68);
  color: var(--docs-text);
  text-decoration: none;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.docs-group-link:hover {
  transform: translateY(-1px);
  border-color: var(--docs-border-strong);
  background: rgba(26, 37, 70, 0.88);
}

.docs-group-link span:last-child {
  color: var(--docs-link-strong);
}

.docs-empty {
  margin: 1.25rem 0 0;
  padding: 1rem 1.1rem;
  border: 1px dashed var(--docs-border-strong);
  border-radius: 16px;
  color: var(--docs-text-muted);
}

.docs-swagger {
  padding-bottom: 2.5rem;
}

.docs-swagger #swagger-ui {
  margin-top: 1.25rem;
}

.swagger-ui {
  color: var(--docs-text);
}

.swagger-ui .topbar {
  display: none;
}

.swagger-ui .information-container,
.swagger-ui .scheme-container,
.swagger-ui .opblock-tag,
.swagger-ui .opblock,
.swagger-ui .responses-inner,
.swagger-ui .model-box,
.swagger-ui section.models,
.swagger-ui .dialog-ux .modal-ux,
.swagger-ui .response-col_description__inner div.markdown,
.swagger-ui .response-col_description__inner div.renderedMarkdown {
  background: var(--docs-surface-strong);
  border-color: var(--docs-border);
  color: var(--docs-text);
}

.swagger-ui .scheme-container,
.swagger-ui .information-container,
.swagger-ui section.models {
  box-shadow: none;
  border-radius: 18px;
}

.swagger-ui .info .title,
.swagger-ui .info hgroup.main a,
.swagger-ui .info p,
.swagger-ui .info li,
.swagger-ui .opblock-tag,
.swagger-ui .opblock .opblock-summary-description,
.swagger-ui .parameter__name,
.swagger-ui .response-col_status,
.swagger-ui .tab li,
.swagger-ui .model-title,
.swagger-ui .prop-type,
.swagger-ui .responses-header td,
.swagger-ui table thead tr td,
.swagger-ui table thead tr th,
.swagger-ui .markdown p,
.swagger-ui .markdown code,
.swagger-ui label,
.swagger-ui .authorization__btn {
  color: var(--docs-text);
}

.swagger-ui .info a,
.swagger-ui .link,
.swagger-ui .opblock-summary-path,
.swagger-ui .opblock-summary-method,
.swagger-ui .tab li button.tablinks {
  color: var(--docs-link-strong);
}

.swagger-ui .btn,
.swagger-ui select,
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui input[type=email],
.swagger-ui textarea {
  border-radius: 12px;
  border-color: var(--docs-border-strong);
  background: rgba(8, 13, 27, 0.95);
  color: var(--docs-text);
}

.swagger-ui .btn.execute {
  background: #315efb;
  border-color: #315efb;
  color: #f8fbff;
}

.swagger-ui .opblock.opblock-get {
  border-color: rgba(80, 191, 255, 0.42);
}

.swagger-ui .opblock.opblock-post {
  border-color: rgba(61, 220, 151, 0.36);
}

.swagger-ui .opblock.opblock-put,
.swagger-ui .opblock.opblock-patch {
  border-color: rgba(255, 181, 72, 0.38);
}

.swagger-ui .opblock.opblock-delete {
  border-color: rgba(255, 108, 108, 0.38);
}

@media (max-width: 720px) {
  .docs-shell {
    width: min(100% - 1rem, 100%);
  }

  .docs-hero {
    padding-top: 1.5rem;
    align-items: start;
    flex-direction: column;
  }
}
`;
}

function renderDocsIndex(title: string, mountPath: string, groups: string[]) {
  const links = groups
    .map(
      (group) =>
        `<li><a class="docs-group-link" href="${mountPath}/${group}"><span>${group}</span><span>Open docs</span></a></li>`
    )
    .join('');
  const stylesheetPath = `${mountPath}/docs.css`;
  const logoPath = `${mountPath}/logo.png`;
  const faviconMarkup = hasDocsLogo()
    ? `<link rel="icon" type="image/png" href="${logoPath}" />`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    ${faviconMarkup}
    <link rel="stylesheet" href="${stylesheetPath}" />
  </head>
  <body>
    <main class="docs-shell">
      <section class="docs-hero">
        <div>
          <p class="docs-eyebrow">Swagger</p>
          <h1 class="docs-title">${title}</h1>
          <p class="docs-subtitle">Explore the generated API groups below. The default experience is optimized for dark environments.</p>
        </div>
      </section>
      <section class="docs-panel">
        <p class="docs-eyebrow">Available groups</p>
        ${links ? `<ul class="docs-group-list">${links}</ul>` : '<p class="docs-empty">No groups registered.</p>'}
      </section>
    </main>
  </body>
</html>`;
}

function renderGroupPage(title: string, mountPath: string, group: string) {
  const assetsPath = `${mountPath}/assets`;
  const stylesheetPath = `${mountPath}/docs.css`;
  const initializerPath = `${mountPath}/${group}/swagger-initializer.js`;
  const logoPath = `${mountPath}/logo.png`;
  const logoMarkup = hasDocsLogo()
    ? `<img class="docs-logo" src="${logoPath}" alt="API logo" />`
    : '';
  const faviconMarkup = hasDocsLogo()
    ? `<link rel="icon" type="image/png" href="${logoPath}" />`
    : '';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} - ${group}</title>
    ${faviconMarkup}
    <link rel="stylesheet" href="${stylesheetPath}" />
    <link rel="stylesheet" href="${assetsPath}/swagger-ui.css" />
  </head>
  <body class="docs-swagger">
    <main class="docs-shell">
      <section class="docs-hero">
        <div>
          <p class="docs-eyebrow">Swagger UI</p>
          <div class="docs-title-row">
            ${logoMarkup}
            <h1 class="docs-title">${title}</h1>
          </div>
          <p class="docs-subtitle">Browsing group <strong>${group}</strong>.</p>
        </div>
        <a class="docs-back" href="${mountPath}">All groups</a>
      </section>
      <div id="swagger-ui"></div>
    </main>
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

function resolveDocsLogoPath() {
  const logoPath = path.resolve(process.cwd(), docsLogoRelativePath);
  return fs.existsSync(logoPath) ? logoPath : undefined;
}

function hasDocsLogo() {
  return Boolean(resolveDocsLogoPath());
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

  router.get(`${mountPath}/docs.css`, (_req: Request, res: Response) => {
    res.type('text/css').send(renderDocsStylesheet());
  });

  router.get(`${mountPath}/logo.png`, (_req: Request, res: Response) => {
    const logoPath = resolveDocsLogoPath();

    if (!logoPath) {
      res.status(404).type('text/plain').send('Swagger logo not found');
      return;
    }

    res.sendFile(logoPath);
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
