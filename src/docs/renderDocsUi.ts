export function renderDocsStylesheet() {
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
  width: min(80vw, calc(100% - 2rem));
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
  color: var(--docs-text);
}

.docs-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.docs-title-lockup {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.docs-meta-badges {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.docs-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
}

.docs-badge-neutral {
  background: rgba(214, 220, 235, 0.86);
  color: #3f4a66;
}

.docs-badge-accent {
  background: #a6d400;
  color: #233000;
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

.docs-json-path {
  display: inline-block;
  margin-top: 0.5rem;
  color: var(--docs-text);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
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

.swagger-ui .information-container {
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

.swagger-ui .information-container,
.swagger-ui .scheme-container,
.swagger-ui .scheme-container .schemes,
.swagger-ui .scheme-container .auth-wrapper,
.swagger-ui .scheme-container .auth-container,
.swagger-ui .scheme-container .auth-container section {
  background: transparent !important;
}

.swagger-ui .information-container,
.swagger-ui .scheme-container {
  border: 0;
}

.swagger-ui .info .title,
.swagger-ui .info hgroup.main a,
.swagger-ui .info hgroup.main,
.swagger-ui .info p,
.swagger-ui .info li,
.swagger-ui .info .base-url,
.swagger-ui .info .base-url code,
.swagger-ui .info .base-url a,
.swagger-ui .opblock-tag,
.swagger-ui .opblock .opblock-summary-description,
.swagger-ui .opblock .opblock-summary-path,
.swagger-ui .opblock .opblock-summary-path__deprecated,
.swagger-ui .opblock .opblock-summary-operation-id,
.swagger-ui .opblock .opblock-summary-control,
.swagger-ui .opblock-description-wrapper p,
.swagger-ui .opblock-external-docs-wrapper p,
.swagger-ui .opblock-title_normal p,
.swagger-ui .parameter__name,
.swagger-ui .parameter__type,
.swagger-ui .parameter__deprecated,
.swagger-ui .parameter__in,
.swagger-ui .parameters-col_description,
.swagger-ui .parameters-col_description p,
.swagger-ui .parameters-col_description div,
.swagger-ui .response-col_status,
.swagger-ui .response-col_description,
.swagger-ui .response-col_description p,
.swagger-ui .response-col_links,
.swagger-ui .responses-inner h4,
.swagger-ui .responses-inner h5,
.swagger-ui .tab li button.tablinks,
.swagger-ui .tab li,
.swagger-ui .model-title,
.swagger-ui .prop-type,
.swagger-ui .prop-format,
.swagger-ui .property-row,
.swagger-ui .property-row .property-name,
.swagger-ui .property-row .property-type,
.swagger-ui .property-row .property-format,
.swagger-ui .responses-header td,
.swagger-ui table thead tr td,
.swagger-ui table thead tr th,
.swagger-ui table tbody tr td,
.swagger-ui .markdown p,
.swagger-ui .markdown code,
.swagger-ui .renderedMarkdown p,
.swagger-ui .renderedMarkdown code,
.swagger-ui label,
.swagger-ui .authorization__btn,
.swagger-ui .dialog-ux .modal-ux-header h3,
.swagger-ui .dialog-ux .modal-ux-content,
.swagger-ui .dialog-ux .modal-ux-content p,
.swagger-ui .dialog-ux label,
.swagger-ui .dialog-ux .scopes h2,
.swagger-ui .dialog-ux .scope-def,
.swagger-ui .servers > label {
  color: var(--docs-text);
}

.swagger-ui .info a,
.swagger-ui .link,
.swagger-ui .tab li button.tablinks {
  color: var(--docs-link-strong);
}

.swagger-ui .opblock .opblock-summary-method {
  font-size: 11px;
}

.swagger-ui .opblock .opblock-summary-path,
.swagger-ui .opblock .opblock-summary-path__deprecated {
  font-size: 12px;
}

@container swagger-ui (max-width: 768px) {
  .swagger-ui .opblock .opblock-summary-method {
    font-size: 9px;
  }

  .swagger-ui .opblock .opblock-summary-path,
  .swagger-ui .opblock .opblock-summary-path__deprecated {
    font-size: 9px;
  }
}

.swagger-ui .opblock-tag,
.swagger-ui .opblock .opblock-summary-path,
.swagger-ui .opblock .opblock-summary-description,
.swagger-ui .parameters-col_name,
.swagger-ui .response-col_status {
  color: var(--docs-text) !important;
}

.swagger-ui .opblock-section-header,
.swagger-ui .opblock-section-header > div,
.swagger-ui .responses-inner > div,
.swagger-ui .responses-table,
.swagger-ui table tbody tr td,
.swagger-ui .parameter__extension,
.swagger-ui .parameters-container,
.swagger-ui .execute-wrapper,
.swagger-ui .body-param,
.swagger-ui .body-param__text,
.swagger-ui .body-param-options,
.swagger-ui .model-example,
.swagger-ui .highlight-code,
.swagger-ui .microlight,
.swagger-ui .response-control-media-type,
.swagger-ui .servers,
.swagger-ui .servers-title,
.swagger-ui .servers > label {
  background: transparent !important;
}

.swagger-ui .highlight-code,
.swagger-ui .highlight-code pre,
.swagger-ui .microlight,
.swagger-ui pre.microlight,
.swagger-ui .model-example,
.swagger-ui .model-example pre,
.swagger-ui .example,
.swagger-ui .example textarea {
  background: rgba(5, 10, 20, 0.96) !important;
  border-radius: 14px;
}

.swagger-ui .opblock-section-header {
  box-shadow: none;
}

.swagger-ui .opblock-section-header h4,
.swagger-ui .opblock-section-header label,
.swagger-ui .opblock-section-header .tab-header .tab-item button,
.swagger-ui .responses-inner .responses-header td,
.swagger-ui .responses-inner .response-col_status,
.swagger-ui .responses-inner .response-col_description,
.swagger-ui .responses-inner .tab li,
.swagger-ui .responses-inner .tab li button {
  color: var(--docs-text) !important;
}

.swagger-ui .opblock-body,
.swagger-ui .opblock-body p,
.swagger-ui .opblock-body span,
.swagger-ui .opblock-body div,
.swagger-ui .opblock-body li,
.swagger-ui .opblock-body td,
.swagger-ui .opblock-body th,
.swagger-ui .opblock-body label,
.swagger-ui .opblock-body h4,
.swagger-ui .opblock-body h5,
.swagger-ui .opblock-body .markdown,
.swagger-ui .opblock-body .renderedMarkdown,
.swagger-ui .opblock-body .renderedMarkdown p,
.swagger-ui .opblock-body .parameter__name,
.swagger-ui .opblock-body .parameter__type,
.swagger-ui .opblock-body .parameter__in,
.swagger-ui .opblock-body .body-param__text,
.swagger-ui .opblock-body .body-param__text__name,
.swagger-ui .opblock-body .body-param__text__value,
.swagger-ui .opblock-body .json-schema-2020-12,
.swagger-ui .opblock-body .json-schema-2020-12 *,
.swagger-ui .opblock-body .model,
.swagger-ui .opblock-body .model *,
.swagger-ui .opblock-body .property,
.swagger-ui .opblock-body .property-row,
.swagger-ui .opblock-body .property-row *,
.swagger-ui .opblock-body .model-title,
.swagger-ui .opblock-body .prop-type,
.swagger-ui .opblock-body .prop-format,
.swagger-ui .opblock-body .response-col_description,
.swagger-ui .opblock-body .response-col_links,
.swagger-ui .opblock-body .responses-inner h4,
.swagger-ui .opblock-body .responses-inner h5 {
  color: var(--docs-text) !important;
}

.swagger-ui .opblock-tag svg,
.swagger-ui .opblock .arrow,
.swagger-ui .opblock .arrow svg,
.swagger-ui .expand-operation svg,
.swagger-ui .expand-methods svg,
.swagger-ui .models-control svg,
.swagger-ui .model-toggle:after,
.swagger-ui .authorization__btn svg {
  fill: var(--docs-text) !important;
  color: var(--docs-text) !important;
  stroke: var(--docs-text) !important;
}

.swagger-ui .btn,
.swagger-ui select,
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=search],
.swagger-ui input[type=email],
.swagger-ui input[type=file],
.swagger-ui input[type=number],
.swagger-ui input[type=url],
.swagger-ui input[type=tel],
.swagger-ui textarea {
  border-radius: 12px;
  border-color: var(--docs-border-strong);
  background: rgba(8, 13, 27, 0.95);
  color: var(--docs-text);
}

.swagger-ui input::placeholder,
.swagger-ui textarea::placeholder {
  color: var(--docs-text-muted);
}

.swagger-ui .opblock-body select,
.swagger-ui .opblock-body input[type=text],
.swagger-ui .opblock-body input[type=password],
.swagger-ui .opblock-body input[type=search],
.swagger-ui .opblock-body input[type=email],
.swagger-ui .opblock-body input[type=file],
.swagger-ui .opblock-body input[type=number],
.swagger-ui .opblock-body input[type=url],
.swagger-ui .opblock-body input[type=tel],
.swagger-ui .opblock-body textarea {
  background: rgba(8, 13, 27, 0.95) !important;
  color: var(--docs-text) !important;
  border-color: var(--docs-border-strong) !important;
  caret-color: var(--docs-text);
}

.swagger-ui .opblock-body select:not(:disabled),
.swagger-ui .opblock-body input[type=text]:not(:disabled),
.swagger-ui .opblock-body input[type=password]:not(:disabled),
.swagger-ui .opblock-body input[type=search]:not(:disabled),
.swagger-ui .opblock-body input[type=email]:not(:disabled),
.swagger-ui .opblock-body input[type=file]:not(:disabled),
.swagger-ui .opblock-body input[type=number]:not(:disabled),
.swagger-ui .opblock-body input[type=url]:not(:disabled),
.swagger-ui .opblock-body input[type=tel]:not(:disabled),
.swagger-ui .opblock-body textarea:not(:disabled) {
  background: rgba(4, 9, 18, 0.98) !important;
  box-shadow: 0 0 0 1px rgba(138, 162, 255, 0.14);
}

.swagger-ui .opblock-body select:not(:disabled):focus,
.swagger-ui .opblock-body input[type=text]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=password]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=search]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=email]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=file]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=number]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=url]:not(:disabled):focus,
.swagger-ui .opblock-body input[type=tel]:not(:disabled):focus,
.swagger-ui .opblock-body textarea:not(:disabled):focus {
  border-color: var(--docs-text) !important;
  box-shadow: 0 0 0 1px rgba(237, 242, 255, 0.22);
  outline: none;
}

.swagger-ui .btn.try-out__btn {
  border-color: var(--docs-text);
  color: var(--docs-text);
}

.swagger-ui select option {
  color: var(--docs-text);
  background: #08111f;
}

.swagger-ui .btn.execute {
  background: #315efb;
  border-color: #315efb;
  color: #f8fbff;
}

.swagger-ui .opblock.opblock-get {
  border-color: rgba(80, 191, 255, 0.42);
}

.swagger-ui .opblock.opblock-get .responses-inner,
.swagger-ui .opblock.opblock-get .responses-table,
.swagger-ui .opblock.opblock-get .responses-inner > div,
.swagger-ui .opblock.opblock-get .responses-inner td,
.swagger-ui .opblock.opblock-get .responses-inner th {
  background: rgba(18, 31, 61, 0.92) !important;
}

.swagger-ui .opblock.opblock-post {
  border-color: rgba(61, 220, 151, 0.36);
}

.swagger-ui .opblock.opblock-post .responses-inner,
.swagger-ui .opblock.opblock-post .responses-table,
.swagger-ui .opblock.opblock-post .responses-inner > div,
.swagger-ui .opblock.opblock-post .responses-inner td,
.swagger-ui .opblock.opblock-post .responses-inner th {
  background: rgba(15, 44, 35, 0.92) !important;
}

.swagger-ui .opblock.opblock-put,
.swagger-ui .opblock.opblock-patch {
  border-color: rgba(255, 181, 72, 0.38);
}

.swagger-ui .opblock.opblock-put .responses-inner,
.swagger-ui .opblock.opblock-put .responses-table,
.swagger-ui .opblock.opblock-put .responses-inner > div,
.swagger-ui .opblock.opblock-put .responses-inner td,
.swagger-ui .opblock.opblock-put .responses-inner th,
.swagger-ui .opblock.opblock-patch .responses-inner,
.swagger-ui .opblock.opblock-patch .responses-table,
.swagger-ui .opblock.opblock-patch .responses-inner > div,
.swagger-ui .opblock.opblock-patch .responses-inner td,
.swagger-ui .opblock.opblock-patch .responses-inner th {
  background: rgba(61, 39, 15, 0.92) !important;
}

.swagger-ui .opblock.opblock-delete {
  border-color: rgba(255, 108, 108, 0.38);
}

.swagger-ui .opblock.opblock-delete .responses-inner,
.swagger-ui .opblock.opblock-delete .responses-table,
.swagger-ui .opblock.opblock-delete .responses-inner > div,
.swagger-ui .opblock.opblock-delete .responses-inner td,
.swagger-ui .opblock.opblock-delete .responses-inner th {
  background: rgba(61, 18, 28, 0.92) !important;
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

export function renderDocsIndex(title: string, mountPath: string, groups: string[], logoPublicPath?: string) {
  const links = groups
    .map(
      (group) =>
        `<li><a class="docs-group-link" href="${mountPath}/${group}"><span>${group}</span><span>Open docs</span></a></li>`
    )
    .join('');
  const stylesheetPath = `${mountPath}/docs.css`;
  const faviconMarkup = logoPublicPath
    ? `<link rel="icon" href="${logoPublicPath}" />`
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

export function renderGroupPage(
  title: string,
  version: string,
  mountPath: string,
  group: string,
  logoPublicPath?: string
) {
  const assetsPath = `${mountPath}/assets`;
  const stylesheetPath = `${mountPath}/docs.css`;
  const initializerPath = `${mountPath}/${group}/swagger-initializer.js`;
  const swaggerJsonUrl = `${mountPath}/${group}/swagger.json`;
  const logoMarkup = logoPublicPath
    ? `<img class="docs-logo" src="${logoPublicPath}" alt="API logo" />`
    : '';
  const faviconMarkup = logoPublicPath
    ? `<link rel="icon" href="${logoPublicPath}" />`
    : '';
  const versionMarkup = `<div class="docs-meta-badges"><span class="docs-badge docs-badge-neutral">${version}</span><span class="docs-badge docs-badge-accent">OAS 3.0</span></div>`;

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
            <div class="docs-title-lockup">
              ${logoMarkup}
              <h1 class="docs-title">${title}</h1>
            </div>
            ${versionMarkup}
          </div>
          <p class="docs-subtitle">Browsing group <strong>${group}</strong>.</p>
          <a class="docs-json-path" href="${swaggerJsonUrl}">${swaggerJsonUrl}</a>
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

export function renderSwaggerInitializer(mountPath: string, group: string) {
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
